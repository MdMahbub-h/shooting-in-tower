export class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: "Preloader" });
    }

    preload() {
        this.load.setPath("assets");
        this.load.image("logo", "loading.png");
        this.load.image("endBg", "end.jpg");

        this.load.audio("bgaudio", "bgaudio.mp3");
        this.load.audio("spinSound1", "spin.mp3");
        this.load.audio("spinSound2", "spin-sound.mp3");
        this.load.audio("congrats", "congrats.mp3");
        this.load.audio("loseSound", "lose-sound.mp3");

        this.load.video("intro", "intro.mp4", "loadeddata", true, true);
    }

    create() {
        const config = {
            image: "logo",
            width: 31,
            height: 25,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
            charsPerRow: 10,
            spacing: { x: 1, y: 1 },
        };
        this.cache.bitmapFont.add(
            "logo",
            Phaser.GameObjects.RetroFont.Parse(this, config)
        );

        this.scene.start("SplashScene");
    }
}
