import Phaser from "phaser";
import Door from "../sprites/Door";
import Elevator from "../sprites/Elevator";
import Player from "../sprites/Player";
import Enemy from "../sprites/Enemy";
import Controls from "../Controls";
import Score from "../Score";
import d from "../dimensions";

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super("Level1Scene");
        this.ENEMY_RESPAWN_DELAY = 500;
        this.maxEnemies = 20;
        this.Health = 100;
    }

    preload() {}

    create() {
        this.Health = 100;
        this.LEFT_WALL_X = this.scale.width * 0.5 - 300;
        this.RIGHT_WALL_X = this.scale.width * 0.5 + 300;
        this.LEFT_GROUND_X = this.scale.width * 0.5 - 300;
        this.RIGHT_GROUND_X = this.scale.width * 0.5 + 60;
        this.FLOOR_HEIGHT = 120;
        this.physics.world.setBounds(0, 0, 1280, 2370);
        this.cameras.main.setBounds(0, 0, 1280, 2370);

        this.background = this.add.group();
        this.createBackground();
        this.platforms = this.physics.add.staticGroup();
        this.doors = this.add.group();
        this.mainGroup = this.add.group();
        this.bullets = this.add.group();
        this.enemies = this.physics.add.group();
        this.elevators = this.add.group();

        this.score = new Score({ scene: this, scale: this.scale });
        this.healthText = this.add
            .text(this.scale.width * 0.49, 20, this.Health, {
                font: "40px Arial",
                fill: "#ff0000",
                align: "center",
            })
            .setDepth(6);
        this.cameras.main.ignore(this.score);
        this.healthText.setScrollFactor(0);

        this.player = new Player(this, this.scale.width * 0.515, 0);
        this.mainGroup.add(this.score.text);
        this.controls = new Controls({ scene: this, scale: this.scale });
        this.fpsText = this.add.text(150, 0, "0", {
            font: "16px Arial",
            fill: "#ffffff",
        });
        this.player.setDepth(10);

        this.createGroundPlatforms();
        this.createElevators();
        this.startEnemySpawner();

        this.time.advancedTiming = true;

        this.physics.add.collider(this.player, this.platforms);

        this.physics.add.overlap(
            this.bullets,
            this.enemies,
            this.updateScore,
            null,
            this
        );
        this.physics.add.overlap(
            this.bullets,
            this.player,
            this.updateHealth,
            null,
            this
        );

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        // this.gameOver();
    }

    update() {
        this.controls.update();
        this.fpsText.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);
    }

    updateScore() {
        this.score.addKill();

        console.log(this.score.score);
    }

    updateHealth() {
        this.Health -= 10;
        this.healthText.setText(this.Health);
        if (this.Health <= 0) {
            this.gameOver();
        }
    }

    createBackground() {
        const bg = this.background;

        let sky = this.add.image(0, 0, "sky").setOrigin(0).setScale(2.5, 10);
        bg.add(sky);

        let topBg = this.add
            .image(this.LEFT_WALL_X, 100, "building-bg")
            .setOrigin(0)
            .setScale(64, 110);
        let bottomBg = this.add
            .image(this.LEFT_WALL_X, 10 * this.FLOOR_HEIGHT, "building-bg")
            .setOrigin(0)
            .setScale(64, 1100);

        bg.add(topBg);
        bg.add(bottomBg);
    }

    createGroundPlatforms() {
        // Ground at bottom
        const ground = this.platforms
            .create(0, 2500, "ground")
            .setScale(35, 3)
            .refreshBody();

        // First 9 floors
        let lastY = 0;
        for (let i = 0; i < 20; i++) {
            const y = 100 + i * this.FLOOR_HEIGHT;
            this.createGround(this.LEFT_GROUND_X + 140, y, 2.9);
            this.createWalls(this.LEFT_WALL_X, y);
            this.createWalls(this.RIGHT_WALL_X + 35, y);
            this.createDoors(y + 80);
            this.createGround(this.RIGHT_GROUND_X + 140, y, 2.9);
            lastY = y + this.FLOOR_HEIGHT;
        }
    }

    createWalls(x, y) {
        const wall = this.platforms
            .create(x, y, "wall")
            .setScale(1, 1.5)
            .refreshBody();
    }

    createDoors(y) {
        const doorData = [
            { x: this.LEFT_GROUND_X + 90, dir: "left" },
            { x: this.LEFT_GROUND_X + 175, dir: "left" },
            { x: this.RIGHT_GROUND_X + 90, dir: "right" },
            { x: this.RIGHT_GROUND_X + 175, dir: "right" },
        ];

        doorData.forEach(({ x, dir }) => {
            const door = new Door(this, x, y, "blue", dir);

            this.doors.add(door);
        });
    }

    createGround(x, y, width) {
        this.platforms.create(x, y, "ground").setScale(width, 1).refreshBody();
    }

    createElevators() {
        const elevator = new Elevator(
            this,
            this.LEFT_GROUND_X + 320,
            53,
            20,
            0,
            "down",
            3000
        );

        this.elevators.add(elevator);
        this.physics.add.collider(this.player, this.elevators);
    }

    startEnemySpawner() {
        this.time.addEvent({
            delay: this.ENEMY_RESPAWN_DELAY,
            loop: true,
            callback: () => {
                if (this.enemies.countActive(true) < this.maxEnemies) {
                    const index = Phaser.Math.Between(
                        0,
                        this.doors.getLength() - 1
                    );
                    const door = this.doors.getChildren()[index];

                    const enemy = new Enemy(this, door.x, door.y + 30);
                    this.enemies.add(enemy);
                    door.open();
                }
            },
        });
    }

    gameOver() {
        this.scene.start("GameOverScene", {
            points: this.score.score, // or whatever variable holds the final score
        });
    }
}
