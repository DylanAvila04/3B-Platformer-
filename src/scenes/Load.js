class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.image("purple_spaceman", "character_purple_jump.png");

        this.load.image("Moonarea0", "spritesheet-backgrounds-default.png");
        this.load.image("Moonarea1", "spritesheet-tiles-default.png");
        this.load.image("Moonarea2", "tilemap_packed.png");
        this.load.image("Moonarea3", "tilemap-backgrounds_packed.png");
        this.load.tilemapTiledJSON("Moonarea", "Moonarea.json");
        this.load.audio("jumpSound", "impactSoft_heavy_003.mp3");

        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });


    }

    create() {
        // Add your static player sprite to the scene just to verify it loads correctly
        this.player = this.add.sprite(100, 100, "purple_spaceman");
        this.player.setScale(2);  // Optional: scale up if needed

        this.scene.start("moonBuggedScene");
    }

}