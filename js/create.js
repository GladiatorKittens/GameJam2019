function createTilemap(mapKey) {
    var map = this.make.tilemap({ key: mapKey });
    var tileSet = map.addTilesetImage("tilesheet", "tilesheet");
    //create layers
    map.createStaticLayer("sky", tileSet, 0, 0);
    map.createStaticLayer("background", tileSet, 0, 0);
    //map.createStaticLayer("para", tileSet, 0, 0);
    var collisionlayer = map.createStaticLayer("collision", tileSet, 0, 0);
    collisionlayer.setCollisionByProperty({ collides: true });


    collisionlayer.setCollisionBetween(0, 1000, true);
    //TODO - here is where you add colliders


    //find player spawn point and create them
    //var playerSpawn = map.findObject("obj", function (object) {
    //    if (object.type === "player") {
    //        return object;
    //    }
    //});
    var playerSpawn = {
        x: 100,
        y: 100
    }// TEMP DECLARATION
    //player setup
    createPlayer.call(this, playerSpawn);

    this.physics.add.collider(player.sprite, collisionlayer);

    //create any spawned in point things

    //createEnemies.call(this);

    //create foreground that displays on top
   // map.createStaticLayer("fg1", tileSet, 0, 0);
   // map.createStaticLayer("fg2", tileSet, 0, 0);
    return map;
}
function createPlayer(playerSpawn) {
    player = new Player(this, playerSpawn.x, playerSpawn.y, "player");
    player.sprite.setCollideWorldBounds(true);
}
function createCamera(map) {
    var camera = this.cameras.getCamera("");
    camera.startFollow(player.sprite);
    camera.setBounds(0, 0, map.width * map.tileWidth, map.height * map.tileHeight);
    camera.zoom = 1;
}
function createCollision(map){
    //var collisionLayer = map.getLayer("collision").tilemapLayer;


}
function createKeys() {
    cursors = this.input.keyboard.createCursorKeys();
}