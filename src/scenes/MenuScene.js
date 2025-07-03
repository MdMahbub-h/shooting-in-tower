import { Scene } from "phaser";

export class MenuScene extends Scene {
    constructor() {
        super("MenuScene");
        this.isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );
    }

    init() {
        this.cameras.main.fadeIn(1000);
    }

    create() {
        this.scene.start("BootScene");
        // const video = this.add.video(
        //     this.scale.width / 2,
        //     this.scale.height / 2,
        //     "intro"
        // );
        // video.setOrigin(0.5, 0.5);
        // video.setLoop(false);
        // video.setDisplaySize(this.scale.width / 7, this.scale.height / 4);
        // video.play();

        // video.on("complete", () => {
        //     this.scene.start("BootScene");
        // });

        // this.scale.on("resize", (gameSize) => {
        //     const { width, height } = gameSize;
        //     video.setDisplaySize(width, height);
        // });

        // if (this.isMobile) {
        //     video.setScale(0.4);
        // }
    }
}
