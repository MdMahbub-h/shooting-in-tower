import Phaser from "phaser";
import d from "../dimensions";

export default class Elevator extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, floors, startFloor, startDirection, speed) {
        super(scene, x, y, "elevator");

        this.scene = scene;
        this.ELEVATOR_SPEED = speed;
        this.direction = startDirection;
        this.currentFloor = startFloor;
        this.isMoving = false;

        this.scene.physics.add.existing(this);
        this.setScale(0.7, 1);
        this.body.setSize(120, 20);
        this.body.setOffset(-10, 93);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.floors = [];
        for (let i = 0; i < floors; i++) {
            this.floors.push(y + i * d.FLOOR_HEIGHT);
        }

        this.scene.add.existing(this);

        // Start elevator movement after delay
        this.elevatorTimeout = this.scene.time.delayedCall(
            this.ELEVATOR_SPEED,
            () => {
                this.move(this.direction);
            }
        );
    }

    move(direction) {
        const floors = this.floors;

        console.log("DIRECTION: " + direction);

        if (
            direction !== this.direction ||
            (direction === this.direction && !this.isMoving)
        ) {
            if (this.elevatorTimeout) {
                this.elevatorTimeout.remove(false);
            }

            this.direction = direction;
            this.isMoving = true;

            let nextFloor;
            if (direction === "up") {
                nextFloor =
                    this.currentFloor - 1 >= 0 ? this.currentFloor - 1 : 0;
            } else if (direction === "down") {
                nextFloor =
                    this.currentFloor + 1 < floors.length
                        ? this.currentFloor + 1
                        : floors.length - 1;
            }

            this.currentFloor = nextFloor;

            this.scene.physics.moveTo(this, this.x, floors[nextFloor], 100);

            this.elevatorTimeout = this.scene.time.delayedCall(
                this.ELEVATOR_SPEED,
                () => {
                    this.move(this.direction);
                }
            );
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        const floors = this.floors;
        const targetY = floors[this.currentFloor];
        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.x,
            targetY
        );

        if (distance < 4) {
            // small threshold to avoid jitter
            this.body.setVelocityY(0);
            this.y = targetY; // snap exactly
            this.isMoving = false;

            if (this.direction === "up" && this.currentFloor === 0) {
                this.direction = "down";
            } else if (
                this.direction === "down" &&
                this.currentFloor === floors.length - 1
            ) {
                this.direction = "up";
            }
        }
    }
}
