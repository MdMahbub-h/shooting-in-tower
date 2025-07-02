import Phaser from "phaser";
import Bullet from "./Bullet";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "enemy");

        this.scene = scene;
        this.isDead = false;
        this.direction = "left";
        this.isDucking = false;
        this.isShooting = false;
        this.inElevator = false;
        this.activeElevator = null;
        this.speed = 80;

        this.createAnimations();

        this.scene.physics.add.existing(this);
        this.body.setGravityY(1200);
        this.body.setBounce(0);
        this.setOrigin(0.5, 1);

        this.scene.add.existing(this);
        this.play("eleft");
    }

    createAnimations() {
        const anims = this.scene.anims;

        const create = (key, frames, frameRate = 10, repeat = 0) => {
            if (!anims.exists(key)) {
                anims.create({
                    key,
                    frames: frames.map((f) => ({ key: "enemy", frame: f })),
                    frameRate,
                    repeat,
                });
            }
        };

        // Stand still
        create("eleft", [0], 10, 0);
        create("eright", [1], 10, 0);

        // Walk
        create("ego-left", [12, 14], 10, -1);
        create("ego-right", [13, 15], 10, -1);

        // Shoot
        create("eshoot-left", [6], 1, 0);
        create("eshoot-right", [7], 1, 0);

        // Duck
        create("educk-left", [4], 1, 0);
        create("educk-right", [5], 1, 0);

        // Duck shoot
        create("educk-shoot-left", [10], 1, 0);
        create("educk-shoot-right", [11], 1, 0);

        // Jump
        create("ejump-left", [2], 1, 0);
        create("ejump-right", [3], 1, 0);

        // Jump shoot
        create("ejump-shoot-left", [8], 1, 0);
        create("ejump-shoot-right", [9], 1, 0);

        create("edie", [2, 3, 8, 9], 10, 0);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.isDead) {
            this.body.setVelocityX(0);
            return;
        }

        // Collisions & overlaps
        this.scene.physics.collide(
            this,
            this.scene.platforms,
            this.setOutElevator,
            null,
            this
        );
        this.scene.physics.overlap(
            this,
            this.scene.player,
            this.collision,
            null,
            this
        );
        this.scene.physics.collide(
            this,
            this.scene.elevators,
            this.setInElevator,
            null,
            this
        );

        this.goToPlayerFloor();
    }

    setOutElevator(enemy, platform) {
        setTimeout(() => {
            this.elevator = null;
            this.inElevator = false;
        }, 300);
    }

    setInElevator(enemy, elevator) {
        if (this.body.touching.right || this.body.touching.left) {
            return;
        }
        setTimeout(() => {
            this.elevator = elevator;
            this.inElevator = true;
        }, 300);
    }

    goToPlayerFloor() {
        const player = this.scene.player;
        const elevators = this.scene.elevators.getChildren
            ? this.scene.elevators.getChildren()
            : this.scene.elevators;

        const x = this.x;
        const y = this.y;
        const px = player.x;
        const py = player.y;

        const playerInTheSameFloor = y + 10 > py && y - 50 < py;

        let elevatorInTheSameFloor = false;
        let ex = null;

        if (elevators && elevators.length) {
            for (const elevator of elevators) {
                const ey = elevator.y;
                if (y + 10 > ey && y - 50 < ey) {
                    elevatorInTheSameFloor = true;
                    ex = elevator.x;
                    this.setVelocityY(0);
                    break;
                }
            }
        }

        if (playerInTheSameFloor) {
            if (this.inElevator) {
                if (x < px) this.go("right");
                else this.go("left");
            } else {
                this.stay();
                if (x < px) {
                    this.direction = "right";
                    this.shoot();
                } else {
                    this.direction = "left";
                    this.shoot();
                }
            }
        } else {
            if (this.inElevator) {
                this.stay();
                if (py < y) this.elevator.move("up");
                else this.elevator.move("down");
            } else if (elevatorInTheSameFloor && x < ex + 20) {
                this.go("right");
            } else if (elevatorInTheSameFloor && x > ex) {
                this.go("left");
            } else {
                this.stay();
            }
        }
    }

    stay() {
        this.body.setVelocityX(0);
        this.play("e" + this.direction);
    }

    go(direction) {
        this.direction = direction;
        if (direction === "left") {
            this.body.setVelocityX(-this.speed);
        } else {
            this.body.setVelocityX(this.speed);
        }
        this.play("ego-" + this.direction, true);
    }

    shoot() {
        if (this.isShooting) return;

        this.isShooting = true;

        let x = this.x + (this.direction === "left" ? -15 : 15);
        let y = this.y - 35;

        if (this.isDucking) {
            y += 15;
            this.scene.bullets.add(
                new Bullet(this.scene, x, y, this.direction, "enemy")
            );
            this.play("educk-shoot-" + this.direction);
        } else {
            this.scene.bullets.add(
                new Bullet(this.scene, x, y, this.direction, "enemy")
            );
            this.play("eshoot-" + this.direction);
        }

        setTimeout(() => {
            this.isShooting = false;
        }, 2000);
    }

    collision(enemy, player) {
        if (player.isJumping) {
            if (!this.isDead && this.scene.score) {
                this.scene.score.addJumpKill();
            }
            this.die();
        }
    }

    die() {
        this.isDead = true;
        this.play("edie");
        setTimeout(() => {
            this.destroy();
        }, 1000);
    }
}
