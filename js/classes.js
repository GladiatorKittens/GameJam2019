// JavaScript source code
class Player {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.sprite = this.scene.physics.add.sprite(x, y, texture, 1);
        this.lives = 9;
        this.currentLivesUsed = 0;
        this.jumpCount = 0;
        this.maxJump = 2;
        this.flip = 1;
    }
    update() {
        //console.log(this.flip);

    }
    swipe() {
        var sword = playerSword.get(player.x + 30 * player.flip, player.y);
        if (sword) {
            sword.setDepth(100); //TODO - tweak to what is appropriate
            sword.enableBody(false);
            sword.setActive(true);
            sword.setVisible(true);
            sword.setGravityY(-900);
            if (player.flip == -1) {
                sword.flipX = true;
            } 
            //TODO - put colliders for various things here
            //scene.physics.add.collider(sword, Enemies, killEnemy, null, this);
            sword.on("animationcomplete", onCompleteEvent);
            sword.on("animationupdate", onUpdateEvent);
            sword.play("swipe");
        }
    }
    animations() {//TODO - fix in frame numbers
        this.scene.anims.create({
            key: "walk",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1
        });
        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 4 , end: 5 }),
            frameRate: 3,
            repeat: -1
        });
        this.scene.anims.create({
            key: "jump",
            frames: this.scene.anims.generateFrameNumbers("player", { frames: [6, 7] }),
            frameRate: 5,
            repeat: -1
        });
        this.scene.anims.create({
            key: "down",
            frames: [{ key: "player", frames: 8 }],
            frameRate: 5
        });
        this.scene.anims.create({
            key: "fall",
            frames: [{ key: "player", frames: 8 }],
            frameRate: 5
        });
    }
    movement() {
        //Right
        if (cursors.right.isDown) {
            this.sprite.setVelocityX(100);
            this.sprite.anims.play("walk", true);
            this.sprite.flipX = false;
            this.flip = 1;
        }
        //Left
        else if (cursors.left.isDown) {
            this.sprite.setVelocityX(-100);
            this.sprite.anims.play("walk", true);
            this.sprite.flipX = true;
            this.flip = -1;
        }
        //Down
        else if (cursors.down.isDown) {
            this.sprite.setVelocityX(0);
            this.anims.play("down", true);
        }
        else if (cursors.space.isDown) {
            this.swipe();
        }
        //Idle
        else {
            this.sprite.setVelocityX(0);
            this.sprite.anims.play("idle", true);
        }

        //if (player.body.blocked.down) {
        //    player.jumpCount = 0;
        //}
        if (cursors.up.JustDown && this.jumpCount < this.maxJump) {
            this.jumpCount++;
            this.sprite.setVelocityY(-250);
        }

        //set the values for the sword to follow
        this.x = this.sprite.x;
        this.y = this.sprite.y;
    }
    takeDamage() {
        this.currentLivesUsed++
        if (this.lives == this.currentLivesUsed) {
            gameOver();
        }
    }
    gameOver() {
        this.scene.input.enabled = false;
        this.scene.physics.pause();
        alert("you have been defeated!");
    }
}