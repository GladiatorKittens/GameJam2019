// JavaScript source code
class Player {
    constructor(scene, x, y,lives, texture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.sprite = this.scene.physics.add.sprite(x, y, texture, 1);
        this.lives = 9;
        this.currentLivesUsed = lives;
        this.jumpCount = 0;
        this.maxJump = 2;
        this.flip = 1;
        this.sprite.setSize(34, 54, true);
    }
    swipe() {
        var sword = playerSword.get(player.x + 30 * player.flip, player.y);
        if (sword) {
            swordActive = true;
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
                    this.scene.physics.add.collider(sword, dogs[i].sprite, dogDamagedListener, null, this);
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
            frames: this.scene.anims.generateFrameNumbers("player", { frames:[6] }),
            frameRate: 5,
            repeat: 0
        });
        this.scene.anims.create({
            key: "jump2",
            frames: this.scene.anims.generateFrameNumbers("player", { frames:[7] }),
            frameRate: 5,
            repeat: 0
        });
        this.scene.anims.create({
            key: "down",
            frames: this.scene.anims.generateFrameNumbers("player", { frames:[8]}),
            frameRate: 0
        });
        this.scene.anims.create({
            key: "fall",
            frames: this.scene.anims.generateFrameNumbers("player", { frames:[8]}),
            frameRate: 0
        });
    }
    movement() {
        //Right
        if (cursors.right.isDown) {
            this.sprite.setVelocityX(150);
            this.sprite.flipX = false;
            this.flip = 1;
            if (this.sprite.body.blocked.down) {
              this.sprite.anims.play("walk", true);
            }
        }
        //Left
        else if (cursors.left.isDown) {
            this.sprite.setVelocityX(-150);
            this.sprite.flipX = true;
            this.flip = -1;
            if (this.sprite.body.blocked.down) {
              this.sprite.anims.play("walk", true);
            }
        }
        //Down
        else if (cursors.down.isDown) {
            this.sprite.setVelocityX(0);
            this.sprite.anims.play("down", true);
        }

        //Idle
        else {
            this.sprite.setVelocityX(0);
            this.sprite.anims.play("idle", true);
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
            this.swipe();
        }

        if (this.sprite.body.blocked.down) {
            this.jumpCount = 0;
        }
        //Jump
        if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumpCount < this.maxJump) {
            this.jumpCount++;
            this.sprite.setVelocityY(-290);
            this.sprite.anims.play("jump", true);
        }
        if (this.sprite.body.velocity.y < -60) {
            this.sprite.anims.play("jump2", true);
        } else if (this.sprite.body.velocity.y > 0) {
            this.sprite.anims.play("fall", true);
        }
        //set the values for the sword to follow
        this.x = this.sprite.x;
        this.y = this.sprite.y;
    }
    takeDamage() {
        this.currentLivesUsed++
        console.log(this.currentLivesUsed)
        if (this.lives === this.currentLivesUsed) {
            this.gameOver();
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
        this.state = dogState.IDLE;
        this.lastAttackTime = 0;

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
        this.detect();
        if (this.detectedEnemy === false) {
            this.sprite.anims.play("dogIdle", true);
            this.state = dogState.IDLE;
        } else {
            this.movement();
            this.state = dogState.TRACK;
        }
        this.x = this.sprite.x;
        this.y = this.sprite.y;
    }
    attack() {
        var time = new Date();
        time = time.getTime();

        //is attk on CD?

        var time_diff = time - this.lastAttackTime;
        if (this.state == dogState.ATTACK) return;

        if (time_diff > 5000) {
            this.lastAttackTime = time;
            this.sprite.anims.play("dogAttack", true);
            this.state = dogState.ATTACK;
            this.sprite.on("animationcomplete", this.attackComplete);
        }
    }
    attackCheck() {}
    attackComplete(animation, frame, gameObject) {
        if (animation.key == "dogAttack") {
            this.state = dogState.TRACK;
            var time = new Date();
            time = time.getTime();
            this.lastAttackTime = time;
            player.takeDamage();
            this.anims.play("dogIdle", true);
        }
    }
    movement() {
        if (player.x + 40 < this.x) {
            this.sprite.setVelocityX(-50);
            this.sprite.anims.play("dogWalk", true);
            this.sprite.flipX= true;
        } else if (player.x - 20 > this.x) {
            this.sprite.setVelocityX(50);
            this.sprite.anims.play("dogWalk", true);
            this.sprite.flipX= false;
        } else {
            //TODO - check if y values are similar
            this.sprite.setVelocityX(0);
            this.attack();
        }
    }
    takeDamage(i) {
        this.health--;
        if (this.health <= 0) {
            this.die(i);
        }
    }
    die(i) {
        this.sprite.destroy();
        dogs.splice(i, 1);
    }
}
