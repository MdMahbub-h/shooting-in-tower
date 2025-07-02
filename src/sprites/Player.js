import Phaser from "phaser";
import Bullet from "./Bullet";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player");

        this.scene = scene;

        // Add to scene & physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Constants
        this.STANDUP_HEIGHT = 51;
        this.DUCK_HEIGHT = 31;
        this.JUMP_HEIGHT = 39;

        // Physics setup
        this.setBounce(0);
        this.setGravityY(1200);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 1);
        this.body.setSize(this.width, this.STANDUP_HEIGHT);

        // Custom state
        this.direction = "left";
        this.isJumping = false;
        this.isDucking = false;
        this.isShooting = false;
        this.isOnGround = false;
        this.speed = 150;
        this.lives = 2;
        this.jumpSpeed = 350;
        this.isInElevator = false;
        this.activeElevator = null;

        // Setup animations (must be created globally once)
        this.createAnimations();

        // Initial animation
        this.play("left");
    }

    createAnimations() {
        const anims = this.scene.anims;

        const create = (key, frames, frameRate = 10, repeat = -1) => {
            if (!anims.exists(key)) {
                anims.create({
                    key,
                    frames: frames.map((f) => ({ key: "player", frame: f })),
                    frameRate,
                    repeat,
                });
            }
        };

        create("left", ["left"], 10, 0);
        create("right", ["right"], 10, 0);
        create("go-left", ["go-left-1", "go-left-2"]);
        create("go-right", ["go-right-1", "go-right-2"]);
        create("shoot-left", ["shoot-left"], 10, 0);
        create("shoot-right", ["shoot-right"], 10, 0);
        create("duck-left", ["duck-left"], 10, 0);
        create("duck-right", ["duck-right"], 10, 0);
        create("duck-shoot-left", ["duck-shoot-left"], 10, 0);
        create("duck-shoot-right", ["duck-shoot-right"], 10, 0);
        create("jump-left", ["jump-left"], 10, 0);
        create("jump-right", ["jump-right"], 10, 0);
        create("jump-shoot-left", ["jump-shoot-left"], 10, 0);
        create("jump-shoot-right", ["jump-shoot-right"], 10, 0);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Elevator collisions
        const elevatorCollide = this.scene.physics.collide(
            this,
            this.scene.elevators,
            this.setInElevator,
            null,
            this
        );

        if (!elevatorCollide) {
            this.activeElevator = null;
        }

        // Platform collisions
        const hitPlatform = this.scene.physics.collide(
            this,
            this.scene.platforms
        );
        this.isOnGround = this.body.blocked.down;
        // console.log(&&hitPlatform);

        if (this.isOnGround || this.activeElevator) {
            this.isJumping = false;
        }

        if (this.isJumping) {
            this.body.setSize(this.width, this.JUMP_HEIGHT);
            this.play(
                this.isShooting
                    ? `jump-shoot-${this.direction}`
                    : `jump-${this.direction}`,
                true
            );
        } else if (this.isDucking) {
            this.duck();
        } else {
            this.body.setSize(this.width, this.STANDUP_HEIGHT);
        }
    }

    duck() {
        this.body.setSize(this.width, this.DUCK_HEIGHT);
        this.isDucking = true;
        this.play(
            this.isShooting
                ? `duck-shoot-${this.direction}`
                : `duck-${this.direction}`,
            true
        );
    }

    jump() {
        this.body.setSize(this.width, this.JUMP_HEIGHT);
        this.isJumping = true;
        this.body.setVelocityY(-this.jumpSpeed);
        this.play(`jump-${this.direction}`, true);
    }

    standUp() {
        this.body.setSize(this.width, this.STANDUP_HEIGHT);
        this.isDucking = false;

        this.play(this.direction, true);
    }

    go(direction) {
        this.direction = direction;

        if (direction === "left") {
            this.body.setVelocityX(-this.speed);
        } else if (direction === "right") {
            this.body.setVelocityX(this.speed);
        }

        if (this.isDucking) {
            this.body.setSize(this.width, this.DUCK_HEIGHT);
            this.play(`duck-${direction}`, true);
        } else if (this.isJumping) {
            this.body.setSize(this.width, this.JUMP_HEIGHT);
            this.play(`jump-${direction}`, true);
        } else {
            this.body.setSize(this.width, this.STANDUP_HEIGHT);
            this.play(`go-${direction}`, true);
        }
    }

    stay() {
        this.body.setVelocityX(0);
        this.anims.stop();
    }

    shoot() {
        if (this.isShooting) return;

        this.isShooting = true;

        let x = this.x + (this.direction === "left" ? -10 : 10);
        let y = this.y - 22;

        if (this.isDucking) {
            this.body.setSize(this.width, this.DUCK_HEIGHT);
            y += 15;
        } else if (this.isJumping) {
            this.body.setSize(this.width, this.JUMP_HEIGHT);
        } else {
            this.body.setSize(this.width, this.STANDUP_HEIGHT);
        }

        this.scene.bullets.add(
            new Bullet(this.scene, x, y, this.direction, "player")
        );

        const animKey = this.isDucking
            ? `duck-shoot-${this.direction}`
            : this.isJumping
            ? `jump-shoot-${this.direction}`
            : `shoot-${this.direction}`;

        this.play(animKey, true);

        this.scene.time.delayedCall(300, () => {
            this.isShooting = false;
        });
    }

    moveElevator(direction) {
        if (this.activeElevator) {
            this.activeElevator.move(direction);
        }
    }

    die() {
        this.lives--;
        if (this.lives === 0) {
            this.scene.gameOver();
        }
    }

    setInElevator(player, elevator) {
        this.activeElevator = elevator;
    }
}
