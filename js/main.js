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
                y: 400
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
var player, home;
var levelNum = "1";
function preload() {
    console.log(this);
    this.load.image("tilesheet", "/assets/tilesheet.png");
    //this.load.image("")
    //ALL TILEMAPS GO HERE
    this.load.tilemapTiledJSON("1", "/assets/1.json");
    this.load.spritesheet(
        "player",
        "/assets/CatAnims.png",
        {frameWidth: 64, frameHeight: 64}
    );
    this.load.image("sword", "/assets/tempSword.png")
};

function create(){
    var map = createTilemap.call(this, levelNum);//TODO, add in first map key
    createCamera.call(this, map);
    createCollision.call(this, map);
    createKeys.call(this);
    //player setup
    this.input.keyboard.on("keydown_SPACE", player.swipe, this);   
    this.physics.add.overlap(player, home, endOfLevel, null, this);
    //create groups
    sword = this.physics.add.group({
        defaultKey: "sword",
        maxSize: 1
    });
}
function update() {

}

//NON-PHASER FUNCTIONS
function endOfLevel(levelKey){
    createTilemap(levelKey)
}
//SWORD FUNCTIONS
function swordAnimation(){
    this.anims.create({
        key: "swipe",
        frames: this.anims.generateFrameNumbers("sword", { start: 1, end: 3 }),//TODO - implement frame numbers
        frameRate: 5, //TODO - edit as neccessary for attack speed
        repeat: -1
    });
}
function killSword(sword) {
    sword.disableBody(true, true);
    sword.setActive(false);
    sword.setVisible(false);
}