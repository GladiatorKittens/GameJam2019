//TODO - finish createTilemap function

var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 640,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: {
                y: 250
            }
        }
    },
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
//Any global variable declarations go here
var game = new Phaser.Game(config);
var player, home, map, cursors;
var levelNum = 1;
var dogs = [];
var swordActive = true;
var tempLives = 0;
const dogState = {
    IDLE: "0",
    TRACK: "1",
    ATTACK: "2"
}

function preload() {
    console.log(this);
    this.load.image("tilesheet", "/assets/tilesheet.png");
    this.load.image("objectsheet", "assets/objects.png");
    this.load.image("home", "/assets/sign.png");
    this.load.image("sky", "/assets/sky.png");
    //ALL TILEMAPS GO HERE
    this.load.tilemapTiledJSON("1", "/assets/01.json");
    this.load.tilemapTiledJSON("2", "/assets/02.json");
    this.load.tilemapTiledJSON("3", "/assets/03.json");
    //ALL SPRITESHEETS GO HERE
    this.load.spritesheet(
        "player",
        "/assets/CatAnims.png",
        {frameWidth: 44, frameHeight: 54}
    );
    this.load.spritesheet(
        "sword",
        "/assets/Sword.png",
        { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
        "dog",
        "/assets/Dog.png",
        {frameWidth: 64, frameHeight: 52 }
    );
};

function create(){
    var map = createTilemap.call(this, levelNum, tempLives);
    createCamera.call(this, map);
    swordAnimation.call(this);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    //player setup controls and collision
    createKeys.call(this);
    player.animations();
    loadDogAnimations.call(this);

    //this.physics.add.overlap(player.sprite, home, endOfLevel, null, this);
    //create groups
    playerSword = this.physics.add.group({
        defaultKey: "sword",
        maxSize: 1
    });
}
function update() {
    player.movement();
    for (var i = 0; i < dogs.length; i++) {
        dogs[i].update();
    }
}

//NON-PHASER FUNCTIONS
function endOfLevel(levelKey){
    createTilemap(levelKey);
}
//SWORD FUNCTIONS
function swordAnimation(){
    this.anims.create({
        key: "swipe",
        frames: this.anims.generateFrameNumbers("sword", { start: 0, end: 3 }),
        frameRate: 10
    });
}
function onCompleteEvent(animation, frame, gameObject) {
    gameObject.destroy();
}
function onUpdateEvent(animation, frame, gameObject) {
    gameObject.x = player.x + (30 * player.flip);
    gameObject.y = player.y;
}
function killSword(sword) {
    sword.disableBody(true, true);
    sword.setActive(false);
    sword.setVisible(false);
}
//OTHER
function loadDogAnimations() {
    this.anims.create({
        key: "dogIdle",
        frames: this.anims.generateFrameNumbers("dog", { start: 0, end: 2 }),
        frameRate: 3,
        repeat: -1
    });
    this.anims.create({
        key: "dogWalk",
        frames: this.anims.generateFrameNumbers("dog", { start: 3, end: 4 }),
        frameRate: 3
    });
    this.anims.create({
        key: "dogAttack",
        frames: this.anims.generateFrameNumbers("dog", { start: 5, end: 7 }),
        frameRate: 3,
        yoyo: true
    })
}
function dogDamagedListener(sword, dog) {
    if (swordActive == true) {
        for (var i = 0; i < dogs.length; i++) {
            if (dogs[i].sprite === dog) {
                dogs[i].takeDamage(i);
                swordActive = false;
            }
        }
    }
    //dog.takeDamage();
}
function nextLevel(home, player) {
    for (var i = 0; i < dogs.length; i++) {
        dogs[i].die(i);
    }
    home.destroy();
    levelNum++
    tempLives = player.currentLivesUsed;
    player.destroy();
    create.call(this);
}
function createSpeechBubble(x, y, width, height, quote) {
    var padding = 10;
    var arrowHeight = height / 4;

    var bubble = this.add.graphics({ x: x, y: y });

    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(6, 6, width, height, 16);
    bubble.fillStyle(0xffffff, 1);
    bubble.lineStyle(4, 0x565656, 1);
    bubble.fillRoundedRect(0, 0, width, height, 16);

    var point1X = Math.floor(width / 7);
    var point1Y = height;
    var point2X = Math.floor((width / 7) * 2);
    var point2Y = height;
    var point3X = Math.floor(width / 7);
    var point3Y = Math.floor(height + arrowHeight);

    //  Bubble arrow shadow
    bubble.lineStyle(4, 0x222222, 0.5);
    bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    var content = this.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: width - (padding * 2) } });

    var b = content.getBounds();
    content.setPosition(bubble.x + (width / 2) - (b.width / 2), bubble.y + (height / 2) - (b.height / 2));
}