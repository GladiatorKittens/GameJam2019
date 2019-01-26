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
                y: 900
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


function preload() {
    console.log(this);
    this.load.image("tilesheet", "/assets/tilesheet.png");
    //this.load.image("")
    //ALL TILEMAPS GO HERE
    this.load.tilemapTiledJSON("1", "/assets/1.json");
    this.load.spritesheet(
        "player",
        "/assets/CatAnims.png",
        {frameWidth: 44, frameHeight: 54}
    );
    this.load.spritesheet("sword",
        "/assets/Sword.png",
        { frameWidth: 32, frameHeight: 32 }
    );
};

function create(){
    var map = createTilemap.call(this, levelNum);
    createCamera.call(this, map);
    createCollision.call(this, map);
    swordAnimation.call(this);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    //player setup controls and collision
    createKeys.call(this);
    player.animations();
    this.input.keyboard.on("keydown_SPACE", player.swipe, this);   
    //this.physics.add.overlap(player.sprite, home, endOfLevel, null, this);
    //create groups
    playerSword = this.physics.add.group({
        defaultKey: "sword",
        maxSize: 1
    });
}
function update() {
    player.update();
    player.movement();
}

//NON-PHASER FUNCTIONS
function endOfLevel(levelKey){
    createTilemap(levelKey)
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