class Moonarea extends Phaser.Scene {
    constructor() {
        super("moonBuggedScene");
    }

    init() {
        this.ACCELERATION = 400;
        this.DRAG = 500;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
    }

    create() {
        // Load the tilemap from JSON
        this.map = this.make.tilemap({ key: "Moonarea" });  // From Moonarea.json

        // Add the tileset image (match the name used in Tiled)
        this.tileset = this.map.addTilesetImage("tilemap_packed", "Moonarea2");
        this.tileset2 = this.map.addTilesetImage("tilemap-backgrounds_packed", "Moonarea3");
        this.tileset3 = this.map.addTilesetImage("spritesheet-backgrounds-default","Moonarea0");
        this.tileset4 = this.map.addTilesetImage("spritesheet-tiles-default", "Moonarea1" );
        this.tileset5 = this.map.addTilesetImage("tilemap_packed", "Moonarea2");

        this.coins = this.map.createFromObjects("Earn", {
            name: "Coins",
            key: "tilemap_sheet",
            frame: 152
        });

        // Create background and obstacle layers
        this.backgroundLayer = this.map.createLayer("Background", [this.tileset2, this.tileset3, this.tileset4,this.tileset5], 0, 0);
        this.obstacleLayer = this.map.createLayer("Obstacles", this.tileset, 0, 0);
        this.backgroundLayer = this.map.createLayer("Bottom", this.tileset4, 0,0 );
    

        // Make obstacles collidable
        this.obstacleLayer.setCollisionByProperty({ Collision: true });
        // this.backgroundLayer.setCollisionByProperty({ Collision: true });

        // Create player sprite from image
        my.sprite.player = this.physics.add.sprite(100, 100, "purple_spaceman");
        my.sprite.player.setCollideWorldBounds(false);
        my.sprite.player.setScale(0.25);

        // Collision
        
        this.physics.add.collider(my.sprite.player, this.obstacleLayer);
        

        // Input
        cursors = this.input.keyboard.createCursorKeys();
        this.rKey = this.input.keyboard.addKey('R');

        // Debug toggle
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = !this.physics.world.drawDebug;
            this.physics.world.debugGraphic.clear();
        });

        // Optional: walking smoke effect
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            scale: { start: 0.03, end: 0.1 },
            lifespan: 350,
            alpha: { start: 1, end: 0.1 },
        });
        my.vfx.walking.stop();

        // Camera setup
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

         // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        this.jumpSound = this.sound.add("jumpSound");
        
        this.coinGroup = this.physics.add.staticGroup();



    }

    update() {
        if (cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) my.vfx.walking.start();
        }
        else if (cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) my.vfx.walking.start();
        }
        else {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.vfx.walking.stop();
        }

        if (my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.jumpSound.play();
        }

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
}
