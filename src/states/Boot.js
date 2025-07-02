import Phaser from "phaser";
import WebFont from "webfontloader";

export default class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
        this.fontsReady = false;
    }

    preload() {
        // Show basic loading text
        this.loadingText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            "Loading fonts...",
            { font: "16px Arial", fill: "#dddddd", align: "center" }
        );
        this.loadingText.setOrigin(0.5);

        // Load WebFont
        WebFont.load({
            google: {
                families: ["Bangers"],
            },
            active: () => {
                this.fontsReady = true;
            },
        });

        // Load loader graphics (optional if used in Splash)
        this.load.image("loaderBg", "./assets/images/loader-bg.png");
        this.load.image("loaderBar", "./assets/images/loader-bar.png");
    }

    update() {
        if (this.fontsReady) {
            this.scene.start("Splash");
        }
    }
}
