import { Scene } from "phaser";

export class SplashScene extends Scene {
    constructor() {
        super("SplashScene");
        this.isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    create() {
        // this.scene.start("MenuScene");

        const logo = this.add
            .image(this.scale.width / 2, this.scale.height / 2, "logo")
            .setOrigin(0.5, 0.8)
            .setScale(0.1);
        if (this.isMobile) {
            logo.setScale(0.6);
        }
        const fx = logo.postFX.addShine(0.5, 0.2, 5);

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                const main_camera = this.cameras.main.fadeOut(1000, 0, 0, 0);
                main_camera.once("camerafadeoutcomplete", () => {
                    this.scene.start("MenuScene");
                    // BootScene
                    // MenuScene
                });
            },
        });
    }
}
