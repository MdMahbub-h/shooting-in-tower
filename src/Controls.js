import Phaser from "phaser";

export default class Controls {
    constructor({ scene, scale }) {
        this.scene = scene;
        this.player = scene.player; // assuming scene.player is already defined
        this.cursors = scene.input.keyboard.createCursorKeys();
        //mobile controls shit
        this.showMobileControls = false;
        this.left = false;
        this.right = false;
        this.fire = false;
        this.jump = false;
        this.scale = scale;

        this.init();
    }

    init() {
        const scene = this.scene; // Phaser 3 scene reference

        // Create cursor keys
        this.cursors = scene.input.keyboard.createCursorKeys();

        // Add SPACE key
        this.spaceKey = scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        // Prevent default spacebar scrolling behavior
        window.addEventListener("keydown", (e) => {
            if (e.code === "Space" || e.keyCode === 32) {
                e.preventDefault();
            }
        });

        // Listen for key down events with Phaser 3 events
        this.cursors.down.on("down", () => this.handleDownKey());
        this.cursors.up.on("down", () => this.handleUpKey());
        this.spaceKey.on("down", () => this.handleSpaceKey());

        // Mobile controls - create buttons using Phaser 3 Game Objects and input handlers
        this.arrowLeft = scene.add
            .image(this.scale.width * 0.07, this.scale.height * 0.82, "left")
            .setInteractive()
            .setScale(2)
            .setDepth(8)
            .setScrollFactor(0);
        this.arrowRight = scene.add
            .image(this.scale.width * 0.23, this.scale.height * 0.82, "right")
            .setInteractive()
            .setScale(2)
            .setDepth(8)
            .setScrollFactor(0);
        this.arrowDown = scene.add
            .image(this.scale.width * 0.15, this.scale.height * 0.9, "down")
            .setInteractive()
            .setScale(2)
            .setDepth(8)
            .setScrollFactor(0);
        this.btnShoot = scene.add
            .image(this.scale.width * 0.85, this.scale.height * 0.9, "shoot")
            .setInteractive()
            .setScale(0.8)
            .setDepth(8)
            .setScrollFactor(0);
        this.btnJump = scene.add
            .image(this.scale.width * 0.85, this.scale.height * 0.78, "jump")
            .setInteractive()
            .setScale(0.8)
            .setDepth(8)
            .setScrollFactor(0);
        this.btnRestart = scene.add
            .image(this.scale.width * 0.67, 50, "restart")
            .setInteractive()
            .setScrollFactor(0)
            .setDepth(5);
        // this.btnMobileControls = scene.add
        //     .image(this.scale.width * 0.61, 50, "showMobileControls")
        //     .setInteractive()
        //     .setScale(0.5)
        //     .setDepth(5)
        //     .setScrollFactor(0);

        // Set visibility
        this.arrowLeft.visible = this.showMobileControls;
        this.arrowRight.visible = this.showMobileControls;
        this.arrowDown.visible = this.showMobileControls;
        this.btnShoot.visible = this.showMobileControls;
        this.btnJump.visible = this.showMobileControls;

        // Add input events for mobile buttons
        this.arrowLeft.on("pointerdown", () => (this.left = true));
        this.arrowLeft.on("pointerup", () => (this.left = false));
        this.arrowLeft.on("pointerout", () => (this.left = false));

        this.arrowRight.on("pointerdown", () => (this.right = true));
        this.arrowRight.on("pointerup", () => (this.right = false));
        this.arrowRight.on("pointerout", () => (this.right = false));

        this.arrowDown.on("pointerdown", this.handleDownKey, this);

        this.btnShoot.on("pointerdown", this.handleSpaceKey, this);

        this.btnJump.on("pointerdown", this.handleUpKey, this);

        this.btnRestart.on("pointerdown", () => scene.scene.restart());

        // this.btnMobileControls.on(
        //     "pointerdown",
        //     this.toggleMobileControls,
        //     this
        // );
        if (this.scale.height > this.scale.width) {
            this.toggleMobileControls();
        }
    }

    toggleMobileControls() {
        this.showMobileControls = !this.showMobileControls;
        this.arrowLeft.visible = this.showMobileControls;
        this.arrowRight.visible = this.showMobileControls;
        this.arrowDown.visible = this.showMobileControls;
        this.btnShoot.visible = this.showMobileControls;
        this.btnJump.visible = this.showMobileControls;
    }

    handleDownKey() {
        if (this.player.activeElevator) {
            this.player.moveElevator("down");
        } else if (this.player.isOnGround) {
            this.player.duck();
            console.log("test");
        }
    }

    handleUpKey() {
        if (this.player.activeElevator) {
            this.player.moveElevator("up");
        } else if (this.player.isDucking) {
            this.player.standUp();
        } else if (this.player.isOnGround) {
            this.player.jump();
        }
    }

    handleSpaceKey() {
        this.player.shoot();
    }

    update() {
        let cursors = this.cursors;
        this.scene.cameras.main.startFollow(this.player);

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (
            this.player.isOnGround &&
            !this.player.isShooting &&
            !this.player.isJumping
        ) {
            if (
                !cursors.left.isDown &&
                !cursors.right.isDown &&
                !this.left &&
                !this.right
            ) {
                this.player.stay();
            }
        }

        if (cursors.left.isDown || this.left) {
            this.player.go("left");
        }
        if (cursors.right.isDown || this.right) {
            this.player.go("right");
        }
    }
}
