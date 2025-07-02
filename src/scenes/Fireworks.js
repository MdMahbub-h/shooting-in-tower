// fireworks.js

export class Fireworks {
    constructor(scene) {
        this.scene = scene;

        const { ParticleEmitter } = Phaser.GameObjects.Particles;

        this.tints = [
            0xff4136, 0xff851b, 0xffdc00, 0x01ff70, 0x2ecc40, 0x39cccc,
            0x7fdbff, 0x0074d9, 0xf012be,
        ];

        this.vel = new Phaser.Math.Vector2();
        const dragBase = {
            active: true,
            update: (particle, deltaMs, deltaUs) => {
                this.vel.set(particle.velocityX, particle.velocityY);
                this.vel.scale(Math.pow(0.01, deltaUs));
                particle.velocityX = this.vel.x;
                particle.velocityY = this.vel.y;
            },
        };

        const emitterConfig = {
            alpha: {
                onEmit: () => 1,
                onUpdate: (p, k, t) =>
                    0.8 * Phaser.Math.Easing.Cubic.In(1 - t) +
                    Phaser.Math.FloatBetween(-0.1, 0.1),
            },
            angle: { min: 0, max: 360 },
            blendMode: "SCREEN",
            emitting: false,
            frequency: -1,
            gravityY: 128,
            lifespan: { min: 1000, max: 2000 },
            quantity: 500,
            reserve: 500,
            rotate: 45,
            speed: { onEmit: () => Phaser.Math.FloatBetween(0, 35) ** 2 },
        };

        this.renderTexture = this.scene.add
            .renderTexture(
                0,
                0,
                this.scene.sys.canvas.width,
                this.scene.sys.canvas.height
            )
            .setOrigin(0, 0)
            .setBlendMode("ADD")
            .setDepth(10);

        this.emitters = [1, 2, 3].map(() => {
            const emitter = new ParticleEmitter(
                this.scene,
                0,
                0,
                "__WHITE",
                emitterConfig
            );
            emitter.addParticleProcessor(Object.create(dragBase));
            return emitter;
        });

        // Launch emitters at intervals
        this.scene.time.addEvent({
            delay: 2000,
            loop: true,
            callback: () => this.launch(this.emitters[0]),
        });
        this.scene.time.addEvent({
            delay: 3000,
            loop: true,
            callback: () => this.launch(this.emitters[1]),
        });
        this.scene.time.addEvent({
            delay: 5000,
            loop: true,
            callback: () => this.launch(this.emitters[2]),
        });

        this.launchEvents = [
            this.scene.time.addEvent({
                delay: 2000,
                loop: true,
                callback: () => this.launch(this.emitters[0]),
            }),
            this.scene.time.addEvent({
                delay: 3000,
                loop: true,
                callback: () => this.launch(this.emitters[1]),
            }),
            this.scene.time.addEvent({
                delay: 5000,
                loop: true,
                callback: () => this.launch(this.emitters[2]),
            }),
        ];

        this.scene.events.on("update", this.update, this);
    }

    launch(emitter) {
        emitter.particleX =
            this.scene.scale.width * Phaser.Math.FloatBetween(0.2, 0.8);
        emitter.particleY =
            this.scene.scale.height * Phaser.Math.FloatBetween(0.2, 0.6);
        emitter.setParticleTint(Phaser.Utils.Array.GetRandom(this.tints));
        emitter.explode();
    }

    stop() {
        // Remove update listener
        this.scene.events.off("update", this.update, this);

        // Stop launching events
        if (this.launchEvents) {
            this.launchEvents.forEach((event) => event.remove(false));
        }

        // Stop all emitters from rendering
        this.emitters.forEach((emitter) => {
            emitter.stop();
        });

        // Optional: clear the render texture
        this.renderTexture.clear();

        // Optional: hide or destroy the render texture
        // this.renderTexture.setVisible(false);
        // this.renderTexture.destroy(); // if no longer needed
    }

    start() {
        // Reattach update loop
        this.scene.events.on("update", this.update, this);

        // Restart launch events
        this.launchEvents = [
            this.scene.time.addEvent({
                delay: 2000,
                loop: true,
                callback: () => this.launch(this.emitters[0]),
            }),
            this.scene.time.addEvent({
                delay: 3000,
                loop: true,
                callback: () => this.launch(this.emitters[1]),
            }),
            this.scene.time.addEvent({
                delay: 5000,
                loop: true,
                callback: () => this.launch(this.emitters[2]),
            }),
        ];
    }

    update(time, delta) {
        this.emitters.forEach((e) => e.preUpdate(0, delta));
        this.renderTexture.fill(0, 0.95 ** (1000 / delta)).beginDraw();
        this.renderTexture.batchDraw(this.emitters);
        this.renderTexture.endDraw();
    }
}
