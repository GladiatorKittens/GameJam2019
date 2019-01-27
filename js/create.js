function createTilemap(levelNum, lives) {
    var map = this.make.tilemap({ key: levelNum });
    var tileSet = map.addTilesetImage("tilesheet", "tilesheet");
    var objectSet = map.addTilesetImage("objectsheet", "objectsheet");
    //create layers
    //map.createStaticLayer("sky", [tileSet, objectSet], 0, 0);
    this.add.image(0, 0, "sky").setScale(20).setScrollFactor(0);
    map.createStaticLayer("parallax", [tileSet, objectSet], 0, 0).setScrollFactor(0.2, 1);
    map.createStaticLayer("background", [tileSet, objectSet], 0, 0);
    map.createStaticLayer("background+", [tileSet, objectSet], 0, 0);
    var collisionlayer = map.createStaticLayer("collision", [tileSet, objectSet], 0, 0);
    collisionlayer.setCollisionByProperty({ collides: true });
    collisionlayer.setCollisionBetween(0, 1000, true);


    //find player spawn point and create them
    var playerSpawn = map.findObject("object", function (object) {
        if (object.type === "player") {
            return object;
        }
    });
    //player setup
    createPlayer.call(this, playerSpawn,lives);

    //sounds
    sfx.jump = this.sound.add('jump');
    sfx.step = this.sound.add('step', { loop: false, volume: 0.15 });
    sfx.bark = this.sound.add('bark');
    sfx.sword = this.sound.add('sword');

    //create any spawned in point things
    var enemySpawns = [];
    map.findObject("object", function (object) {
        if (object.type === "dog") {
            enemySpawns.push(object);
        }
    })
    createEnemies.call(this, enemySpawns);
    //creates exit
    var homeSpawn = map.findObject("object", function (object) {
        if (object.type === "home") {
            return object;
        }
    })
    home = this.physics.add.image(homeSpawn.x, homeSpawn.y, "home");
    //creates story speech bubbles
    var speechSpawns = [];
    map.findObject("object", function (object) {
        if (object.type === "speech") {
            speechSpawns.push(object);
        }
    })
    //here is where you add colliders
    this.physics.add.collider(player.sprite, collisionlayer);
    for (var i = 0; i < dogs.length; i++) {
        this.physics.add.collider(dogs[i].sprite, collisionlayer);
        this.physics.add.overlap(dogs[i].sprite, player.sprite, dogs[i].attackCheck, null, this);
    }
    for (var i = 0; i < speechSpawns.length; i++) {
        createSpeechBubble.call(this, speechSpawns[i].x, speechSpawns[i].y, 200, 100, speechSpawns[i].name);
        this.physics.add.collider(speechSpawns[i], collisionlayer);
        //this.physics.add.overlap(speechSpawns[i], player, showBubble, null, this);
    }
    this.physics.add.collider(home, collisionlayer);
    this.physics.add.overlap(home, player.sprite, nextLevel, null, this);
    //create foreground that displays on top
   // map.createStaticLayer("fg1", tileSet, 0, 0);
   // map.createStaticLayer("fg2", tileSet, 0, 0);
    return map;
}
function createPlayer(playerSpawn, lives) {
    player = new Player(this, playerSpawn.x, playerSpawn.y,lives, "player");
    player.sprite.setCollideWorldBounds(true);
    player.sprite.setDepth(50);
}
function createEnemies(enemySpawns) {
    for (var i = 0; i < enemySpawns.length; i++) {
        switch (enemySpawns[i].type) {
            case "dog":
                var dog = new Dog(this, enemySpawns[i].x, enemySpawns[i].y, "dog");
                this.physics.add.overlap(player.sprite, dog, dog.attack, null, dog);
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
}
function createEmitter() {
    //particles
    var particles = this.add.particles('dust');

    emitter = particles.createEmitter({
        x: 100,
        y: 100,
        frame: 0,
        quantity: 5,
        frequency: 140,
        angle: { min: -180, max: 0 },
        speed: 20,
        scale: { start: 0.3, end: 0.0 },
        gravityY: 0,
        lifespan: { min: 100, max: 500 }
    });


    //emitter.setSpeed(200);
    emitter.setBlendMode(Phaser.BlendModes.ADD);
}
function createKeys() {
    cursors = this.input.keyboard.createCursorKeys();
}
