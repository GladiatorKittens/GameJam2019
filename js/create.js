function createTilemap(mapKey) {
    var map = this.make.tilemap({ key: mapKey });
    var tileSet = map.addTilesetImage("landscape", "tilesheet");
    //create layers
    //map.createStaticLayer("sky", tileSet, 0, 0);
    map.createStaticLayer("background", tileSet, 0, 0);
    //map.createStaticLayer("para", tileSet, 0, 0);
    map.createStaticLayer("collision", tileSet, 0, 0);

    //find player spawn point and create them
    //var playerSpawn = map.findObject("obj", function (object) {
    //    if (object.type === "player") {
    //        return object;
    //    }
    //});
    var playerSpawn = {
        x: 10,
        y: 10
    }
    //player setup
    createPlayer.call(this, playerSpawn);
    //create any groups

    //create any spawned in point things

    //createEnemies.call(this);

    //create foreground that displays on top
   // map.createStaticLayer("fg1", tileSet, 0, 0);
   // map.createStaticLayer("fg2", tileSet, 0, 0);
    return map;
}
function createPlayer(playerSpawn) {
    //TODO - edit in frame number
    player = new Player(this, playerSpawn.x, playerSpawn.y, "player", "frame_num");
    player.sprite.setCollideWorldBounds(true);
}
function createCamera(map) {
    var camera = this.cameras.getCamera("");
    camera.startFollow(player);
    camera.setBounds(0, 0, map.width * map.tileWidth, map.height * map.tileHeight);
    camera.zoom = 2;
}
function createCollision(map){
    var collisionLayer = map.getLayer("collision").tilemapLayer;
    collisionLayer.setCollisionBetween(0, 1000);
    //TODO - here is where you add colliders
}
function createKeys() {
    cursors = this.input.keyboard.createCursorKeys();
}