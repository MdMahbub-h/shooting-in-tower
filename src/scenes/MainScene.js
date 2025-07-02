import { Scene } from "phaser";
import { Fireworks } from "./Fireworks";

export class MainScene extends Scene {
    constructor() {
        super("MainScene");
        this.isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );
    }

    create() {
        this.width = this.scale.width;
        this.height = this.scale.height;

        this.setupSounds();
        this.bgSound.play();
        //     this.fireworks = new Fireworks(this);
        //     this.fireworks.stop();
    }

    setupSounds() {
        this.bgSound = this.sound.add("bgaudio", { volume: 0.6 });
        this.spinSound = this.sound.add("spinSound1");
        this.spinSound2 = this.sound.add("spinSound2");
        this.winSound = this.sound.add("congrats");
        this.loseSound = this.sound.add("loseSound");
    }

    update() {}
}
