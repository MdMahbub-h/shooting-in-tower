import Phaser from "phaser";

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, direction, shooter) {
        super(scene, x, y, "bullet");

        this.scene = scene;
        this.speed = 300;
        this.shooter = shooter; // 'player' or 'enemy'

        this.setOrigin(0.5);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setImmovable(true);

        if (direction === "left") {
            this.setVelocityX(-this.speed);
        } else {
            this.setVelocityX(this.speed);
        }

        // Add to bullet group if you use one (optional)
        // this.scene.bullets.add(this);

        // Overlap checks
        this.scene.physics.add.overlap(
            this,
            this.scene.player,
            this.hitPlayer,
            null,
            this
        );
        this.scene.physics.add.overlap(
            this,
            this.scene.platforms,
            this.hitPlatform,
            null,
            this
        );
        this.scene.physics.add.overlap(
            this,
            this.scene.enemies,
            this.hitEnemy,
            null,
            this
        );
    }

    hitEnemy(bullet, enemy) {
        // if (this.shooter === "player") {
        this.destroy();
        if (enemy.die) enemy.die();
        // if (typeof this.scene.updateScore === "function") {
        //     this.scene.updateScore();
        // }
        // }
    }

    hitPlayer(bullet, player) {
        if (this.shooter === "enemy") {
            this.destroy();
            // if (player.die) player.die();
        }
    }

    hitPlatform() {
        this.destroy();
    }
}
