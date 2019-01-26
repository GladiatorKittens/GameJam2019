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
var player, home, cursors;
var levelNum = 1;
var dogs = [];
var swordActive = true;
const dogState = {
    IDLE: "0",
    TRACK: "1",
    ATTACK: "2"
}

function preload() {
    console.log(this);
    this.load.image("tilesheet", "/assets/tilesheet.png");
    //this.load.image("")
    //ALL TILEMAPS GO HERE
    this.load.tilemapTiledJSON("1", "/assets/01.json");

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
    var map = createTilemap.call(this, levelNum);
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