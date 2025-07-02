import Phaser from "phaser";

export default class Splash extends Phaser.Scene {
    constructor() {
        super("Splash");
    }

    preload() {
        // Loader background and bar
        this.loaderBg = this.add.sprite(
            this.scale.width / 2,
            this.scale.height / 2,
            "loaderBg"
        );
        this.loaderBar = this.add.sprite(
            this.scale.width / 2,
            this.scale.height / 2,
            "loaderBar"
        );
        this.loaderBg.setOrigin(0.5);
        this.loaderBar.setOrigin(0.5);

        // Display loading progress on loaderBar
        this.load.on("progress", (value) => {
            this.loaderBar.setScale(value, 1);
        });

        // Load assets
        this.load.image("sky", "assets/images/sky.png");
        this.load.video(
            "intro",
            "assets/images/intro.mp4",
            "loadeddata",
            false,
            true
        );
        this.load.image("building-bg", "assets/images/building-bg.png");
        this.load.image("ground", "assets/images/platform.png");
        this.load.image("elevator", "assets/images/elevator.png");
        this.load.image("wall", "assets/images/wall.png");

        this.load.atlas(
            "player",
            "assets/images/player/player.png",
            "assets/images/player/player.json"
        );
        this.load.spritesheet("enemy", "assets/images/enemy.png", {
            frameWidth: 19,
            frameHeight: 51,
        });
        this.load.spritesheet("door", "assets/images/doors.png", {
            frameWidth: 35,
            frameHeight: 67,
        });
        this.load.spritesheet("bullet", "assets/images/bullet.png", {
            frameWidth: 5,
            frameHeight: 2,
        });
        this.load.spritesheet("startButton", "assets/images/startButton.png", {
            frameWidth: 200,
            frameHeight: 80,
        });

        // Mobile controls
        this.load.spritesheet("up", "assets/images/controls/arrow-up.png", {
            frameWidth: 50,
            frameHeight: 50,
        });
        this.load.spritesheet("down", "assets/images/controls/arrow-down.png", {
            frameWidth: 50,
            frameHeight: 50,
        });
        this.load.spritesheet("left", "assets/images/controls/arrow-left.png", {
            frameWidth: 50,
            frameHeight: 50,
        });
        this.load.spritesheet(
            "right",
            "assets/images/controls/arrow-right.png",
            { frameWidth: 50, frameHeight: 50 }
        );
        this.load.spritesheet("jump", "assets/images/controls/btn-jump.png", {
            frameWidth: 150,
            frameHeight: 150,
        });
        this.load.spritesheet("shoot", "assets/images/controls/btn-fire.png", {
            frameWidth: 150,
            frameHeight: 150,
        });
        this.load.spritesheet("restart", "assets/images/controls/restart.png", {
            frameWidth: 50,
            frameHeight: 50,
        });
        this.load.spritesheet(
            "showMobileControls",
            "assets/images/controls/show-mobile-controls.png",
            { frameWidth: 180, frameHeight: 120 }
        );
    }

    create() {
        // Or skip video and go immediately to the next scene
        this.scene.start("Level1Scene");
    }
}
