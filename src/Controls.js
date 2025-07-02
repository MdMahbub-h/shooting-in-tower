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
            .image(0, 480, "left")
            .setInteractive()
            .setScale(2.5)
            .setScrollFactor(0);
        this.arrowRight = scene.add
            .image(140, 480, "right")
            .setInteractive()
            .setScale(2.5)
            .setScrollFactor(0);
        this.arrowDown = scene.add
            .image(70, 595, "down")
            .setInteractive()
            .setScale(2.5)
            .setScrollFactor(0);
        this.btnShoot = scene.add
            .image(1100, 540, "shoot")
            .setInteractive()
            .setScrollFactor(0);
        this.btnJump = scene.add
            .image(1100, 360, "jump")
            .setInteractive()
            .setScrollFactor(0);
        this.btnRestart = scene.add
            .image(this.scale.width * 0.67, 50, "restart")
            .setInteractive()
            .setScrollFactor(0)
            .setDepth(5);
        this.btnMobileControls = scene.add
            .image(this.scale.width * 0.61, 50, "showMobileControls")
            .setInteractive()
            .setScale(0.5)
            .setDepth(5)
            .setScrollFactor(0);

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

        this.btnMobileControls.on(
            "pointerdown",
            this.toggleMobileControls,
            this
        );
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
