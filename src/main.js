import { Game } from "phaser";
import { Preloader } from "./preloader";
import { GameOverScene } from "./scenes/GameOverScene";
import { HudScene } from "./scenes/HudScene";
import { MainScene } from "./scenes/MainScene";
import { MenuScene } from "./scenes/MenuScene";
import { SplashScene } from "./scenes/SplashScene";
import BootScene from "./states/Boot";
import Splash from "./states/Splash";
import Level1Scene from "./states/Level1";

let width = window.innerWidth;
let height = window.innerHeight;
console.log(width, height);
if (height > width) {
    width = 800;
    height = 1200;
} else if (width < 1920) {
    width = window.innerWidth;
    height = (1080 * width) / 1920;
} else if (height < 1080) {
    height = window.innerHeight;
    width = (1920 * height) / 1080;
}

console.log(width, height);

const config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    backgroundColor: "#000",
    max: {
        width: width,
        height: height,
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: [
        Preloader,
        SplashScene,
        MainScene,
        MenuScene,
        HudScene,
        GameOverScene,
        BootScene,
        Splash,
        Level1Scene,
    ],
};

new Game(config);
