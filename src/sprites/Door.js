import Phaser from "phaser";

export default class Door extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, color, direction) {
        super(scene, x, y, "door");

        this.color = color;
        this.direction = direction;
        this.scene = scene;

        // Add this door sprite to the scene
        this.scene.add.existing(this);

        // Setup animations if not already created globally
        this.createAnimations();

        // Play the default animation for the door
        this.play(`${this.color}-${this.direction}`);
    }

    createAnimations() {
        const anims = this.scene.anims;

        // Check if animations exist before creating them
        if (!anims.exists("red-left")) {
            anims.create({
                key: "red-left",
                frames: [{ key: "door", frame: 6 }],
                frameRate: 1,
                repeat: 0,
            });
            anims.create({
                key: "red-right",
                frames: [{ key: "door", frame: 7 }],
                frameRate: 1,
                repeat: 0,
            });

            anims.create({
                key: "red-left-open",
                frames: anims.generateFrameNumbers("door", {
                    frames: [6, 8, 10, 8, 6],
                }),
                frameRate: 5,
                repeat: 0,
            });
            anims.create({
                key: "red-right-open",
                frames: anims.generateFrameNumbers("door", {
                    frames: [7, 9, 11, 9, 7],
                }),
                frameRate: 5,
                repeat: 0,
            });

            anims.create({
                key: "blue-left",
                frames: [{ key: "door", frame: 0 }],
                frameRate: 1,
                repeat: 0,
            });
            anims.create({
                key: "blue-right",
                frames: [{ key: "door", frame: 1 }],
                frameRate: 1,
                repeat: 0,
            });

            anims.create({
                key: "blue-left-open",
                frames: anims.generateFrameNumbers("door", {
                    frames: [0, 2, 4, 2, 0],
                }),
                frameRate: 5,
                repeat: 0,
            });
            anims.create({
                key: "blue-right-open",
                frames: anims.generateFrameNumbers("door", {
                    frames: [1, 3, 5, 3, 1],
                }),
                frameRate: 5,
                repeat: 0,
            });
        }
    }

    open() {
        this.play(`${this.color}-${this.direction}-open`);
    }
}
