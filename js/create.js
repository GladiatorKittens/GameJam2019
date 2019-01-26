function createTilemap(mapKey) {
    var map = this.make.tilemap({ key: mapKey });
    var tileSet = map.addTilesetImage("tilesheet", "tilesheet");
    //create layers
    map.createStaticLayer("sky", tileSet, 0, 0);
    map.createStaticLayer("parallax", tileSet, 0, 0).setScrollFactor(0.2, 1);
    map.createStaticLayer("background", tileSet, 0, 0);
    map.createStaticLayer("background+", tileSet, 0, 0);
    var collisionlayer = map.createStaticLayer("collision", tileSet, 0, 0);
    collisionlayer.setCollisionByProperty({ collides: true });
    collisionlayer.setCollisionBetween(0, 1000, true);


    //find player spawn point and create them
    var playerSpawn = map.findObject("object", function (object) {
        if (object.type === "player") {
            return object;
        }
    });
    //player setup
    createPlayer.call(this, playerSpawn);

    

    //create any spawned in point things
    var enemySpawns = [];
    map.findObject("object", function (object) {
        if (object.type === "dog") {
            enemySpawns.push(object);
        }
    })
    createEnemies.call(this, enemySpawns);
    //TODO - here is where you add colliders
    this.physics.add.collider(player.sprite, collisionlayer);
    for (var i = 0; i < dogs.length; i++) {
        this.physics.add.collider(dogs[i].sprite, collisionlayer);
        this.physics.add.overlap(dogs[i].sprite, player.sprite, dogs[i].attackCheck, null, this);
    }
    //create foreground that displays on top
   // map.createStaticLayer("fg1", tileSet, 0, 0);
   // map.createStaticLayer("fg2", tileSet, 0, 0);
    return map;
}
function createPlayer(playerSpawn) {
    player = new Player(this, playerSpawn.x, playerSpawn.y, "player");
    player.sprite.setCollideWorldBounds(true);
}
function createEnemies(enemySpawns) {
    for (var i = 0; i < enemySpawns.length; i++) {
        switch (enemySpawns[i].type) {
            case "dog":
                var dog = new Dog(this, enemySpawns[i].x, enemySpawns[i].y, "dog");
                this.physics.add.overlap(player.sprite, dog, dog.attack, null, this);
                dog.sprite.setSize(64, 54, true);
                dogs.push(dog);
            break
        }
    }
}
function createCamera(map) {
    var camera = this.cameras.getCamera("");
    camera.startFollow(player.sprite);
    camera.setBounds(0, 0, map.width * map.tileWidth, map.height * map.tileHeight);
    camera.zoom = 1;
    camera.setBackgroundColor("rgba(186, 222, 229, 0)");
}
function createKeys() {
    cursors = this.input.keyboard.createCursorKeys();
}
