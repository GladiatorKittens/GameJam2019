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
        this.grounded = true;
    }
    swipe() {
        var sword = playerSword.get(player.x + 30 * player.flip, player.y);
        if (sword) {
            sword.setDepth(100); //TODO - tweak to what is appropriate
            sword.enableBody(false);
            sword.setActive(true);
            sword.setVisible(true);
            sword.setGravityY(-200);
            if (player.flip == -1) {
                sword.flipX = true;
            }
            //TODO - put colliders for various things here
            if (dogs.length > 0) {
                for (var i = 0; i < dogs.length; i++) {
                    this.scene.scene.physics.add.collider(sword, dogs[i], dogDamagedListener, null, this);
                }
            }
            //scene.physics.add.collider(sword, Enemies, killEnemy, null, this);
            sword.on("animationcomplete", onCompleteEvent);
            sword.on("animationupdate", onUpdateEvent);
            sword.play("swipe");
        }
    }
    animations() {
        this.scene.anims.create({
            key: "walk",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 7,
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
            frames: this.scene.anims.generateFrameNumbers("player", { start: 6, end: 8 }),
            frameRate: 1,
            repeat: 1
        });
        this.scene.anims.create({
            key: "jump2",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 7, end: 8 }),
            frameRate: 1,
            repeat: 1
        });
        this.scene.anims.create({
            key: "down",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 6, end: 6 }),
            frameRate: 5
        });
        this.scene.anims.create({
            key: "fall",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 8, end: 8 }),
            frameRate: 5
        });
    }
    movement() {
        //Right
        if (cursors.right.isDown) {
            this.sprite.setVelocityX(150);
            if (this.grounded) {
              this.sprite.anims.play("walk", true);
            }
            this.sprite.flipX = false;
            this.flip = 1;
        }
        //Left
        else if (cursors.left.isDown) {
            this.sprite.setVelocityX(-150);
            if (this.grounded) {
              this.sprite.anims.play("walk", true);
            }
            this.sprite.flipX = true;
            this.flip = -1;
        }
        //Down
        else if (cursors.down.isDown) {
            this.sprite.setVelocityX(0);
            this.sprite.anims.play("down", true);
        }
        else if (cursors.space.isDown) {
            this.swipe();
        }
        //Idle
        else {
            this.sprite.setVelocityX(0);
            this.sprite.anims.play("idle", true);
        }

        if (this.sprite.body.blocked.down) {
          this.grounded = true;
            this.jumpCount = 0;
        } else {
          this.grounded = false;
        }
        //Jump
        if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumpCount < this.maxJump) {
            this.jumpCount++;
            this.sprite.setVelocityY(-290);
            this.sprite.anims.play("jump",true);
            sfx.jump.play();
        }
        if (this.sprite.body.velocity.y < -50) {
            this.sprite.anims.play("jump2",true);
        } else if (this.sprite.body.velocity.y > 0) {
            this.sprite.anims.play("fall", true);
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

class Dog {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.flip = 1;
        this.health = 2;
        this.sprite = this.scene.physics.add.sprite(x, y, texture, 1);
        this.detectedEnemy = false;
    }
    detect() {
        if (Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) < 320) {
            this.detectedEnemy = true;
            this.movement();
        } else {
            this.detectedEnemy = false;
        }
    }
    update() {
        if (this.detectedEnemy === false) {
            this.sprite.anims.play("dogIdle", true);
        } else {
            this.movement();
        }
        this.x = this.sprite.x;
        this.y = this.sprite.y;
    }
    attack() {
        this.sprite.anims.play("dogAttack", true);
    }
    movement() {
        if (player.x + 20 < this.x) {
            this.sprite.setVelocityX(-50);
            this.sprite.anims.play("dogWalk", true);
        } else if (player.x - 20 > this.x) {
            this.sprite.setVelocityX(50);
            this.sprite.anims.play("dogWalk", true);
        } else {
            this.sprite.setVelocityX(0);
            this.attack();
        }
    }
    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            die();
        }
    }
    die() {
        this.disableBody(true, true);
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
        dogs.splice(index, 1);
    }
}
