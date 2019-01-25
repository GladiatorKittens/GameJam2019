//TODO - finish createTilemap function

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: {
                y: 400
            }
        }
    },
    pxelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
//Any global variable declarations go here
var game = new Phaser.Game(config);
var player, home;
var levelNum = 1;
function preload() {
    console.log(this);
    //load in any assets here
    //this.load.blank()
};

function create(){
    var map = createTilemap.call(this, 1);//TODO, add in first map key
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
        frames: this.anims.generateFrameNumbers("sword", { frames: [] }),//TODO - implement frame numbers
        frameRate: 5, //TODO - edit as neccessary for attack speed
        repeat: -1
    });
}
function killSword(sword) {
    sword.disableBody(true, true);
    sword.setActive(false);
    sword.setVisible(false);
}