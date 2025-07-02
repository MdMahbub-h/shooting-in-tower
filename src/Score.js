import Phaser from "phaser";

export default class Score {
    constructor({ scene, scale }) {
        this.killByBullet = 100;
        this.killByJumping = 150;
        this.killByLight = 150;
        this.lightsOutMultiplicator = 1.5;
        this.redDoors = 500;
        this.levelFinish = 1000;
        this.score = 0;
        this.scale = scale;

        this.lightsOut = false;

        this.text = scene.add.text(
            this.scale.width * 0.36,
            50,
            " Score: " + this.score,
            {
                font: "40px Arial",
                fill: "#000000",
                align: "center",
            }
        );
        this.text.fixedToCamera = true; //our buttons should stay on the same place
        this.text.setScrollFactor(0);
        this.text.setOrigin(0.5, 0.5);
        this.text.setDepth(10);
    }

    setLightsOut(lightsOut) {
        this.lightsOut = lightsOut;
    }

    addKill() {
        let points = this.lightsOut
            ? this.killByBullet * this.lightsOutMultiplicator
            : this.killByBullet;
        this.score += points;
        this.updateText();
    }

    addJumpKill() {
        let points = this.lightsOut
            ? this.killByJumping * this.lightsOutMultiplicator
            : this.killByJumping;
        this.score += points;
        this.updateText();
    }

    addKillByLight() {
        this.score += this.killByLight;
        this.updateText();
    }

    addRedDoors() {
        this.score += this.redDoors;
        this.updateText();
    }

    addLevelFinish() {
        this.score += this.levelFinish;
        this.updateText();
    }

    updateText() {
        this.text.setText(" Score: " + this.score);
    }
}
