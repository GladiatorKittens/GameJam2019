// JavaScript source code
class Player {
    constructor(scene, x, y, texture, frame_num) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.sprite = this.scene.physics.add.sprite(x, y, texture, "name");
        this.lives = 9;
        this.currentLivesUsed = 0;
    }
    update() {

    }
    swipe(pointer) {
        var sword = playerSword.get(this.x, this.y);
        if (sword) {
            sword.setDepth(3); //TODO - tweak to what is appropriate
            sword.enableBody(false);
            sword.setActive(true);
            sword.setVisible(true);
            //TODO - put colliders for various things here
            scene.physics.add.collider(sword, Enemies, killEnemy, null, this);
            sword.anims.play("swipe", true);
            sword.on("animationcomplete", killSword(sword));
        }
    }
    animations() {//TODO - add in frame numbers
        scene.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        scene.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("player", { frames: [4, 5] }),
            frameRate: 5,
            repeat: -1
        });
        scene.anims.create({
            key: "jump",
            frames: this.anims.generateFrameNumbers("player", { frames: [6, 7] }),
            frameRate: 5,
            repeat: -1
        });
    }
    takeDamage() {
        this.currentLivesUsed++
        if (this.lives == this.currentLivesUsed) {
            gameOver();
        }
    }
    gameOver() {
        scene.input.enabled = false;
        scene.physics.pause();
        alert("you have been defeated!");
    }
}