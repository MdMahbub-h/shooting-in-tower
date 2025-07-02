import { Scene } from "phaser";

export class GameOverScene extends Scene {
    end_points = 0;
    constructor() {
        super("GameOverScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    create() {
        this.add
            .image(0, 0, "endBg")
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height);
        this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 2 + 130,
                "CLICK TO RESTART",
                {
                    fontSize: "40px",
                }
            )
            .setOrigin(0.5, 0.5);
        // Click to restart
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.input.on("pointerdown", () => {
                    this.scene.start("MenuScene");
                });
            },
        });
    }
}
