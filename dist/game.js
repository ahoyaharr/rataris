const eventDispatch = new Phaser.Events.EventEmitter();

class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');

        this.selector = null;
    }

    preload() {
        this.load.image("cursor", "./assets/cursor.png");
        this.load.image("tiles", "./assets/tilesets/01003803.png");
        this.load.tilemapTiledJSON("map", "./assets/maps/1-properties.json");

    }

    create() {
        const map = this.make.tilemap({key: "map"});

        // arg1: tileset name in .json exported by Tiled
        // arg2: tileset name in preload function
        const tileset = map.addTilesetImage("01003803", "tiles", 16, 16, 0, 0);
        // const tileset = map.addTilesetImage("01003803", "tiles", 16, 16);

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        this.belowLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);
        const closeE = map.createLayer("Close E", tileset, 0, 0);
        const destroyE = map.createLayer("Destroy E", tileset, 0, 0);
        const closeMiddle = map.createLayer("Close Middle", tileset, 0, 0);
        const destroyMiddle = map.createLayer("Destroy Middle", tileset, 0, 0);
        const closeW = map.createLayer("Close W", tileset, 0, 0);
        const destroyW = map.createLayer("Destroy W", tileset, 0, 0);

        // Phaser supports multiple cameras, but you can access the default camera like this:
        let camera = this.cameras.main;
        camera.zoom = 2

        // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.selector = this.physics.add.sprite(16, 16, 'cursor');
        this.selector.setOrigin(0, 0)
        this.selector.setCollideWorldBounds(true);

        camera.startFollow(this.selector)

        // terrain = new TerrainPlate(this, 100, 100);

        this.selector.frames_since_move = 0;
        let sel = this.selector;
        // this.scene.start('TerrainPanel');
    }


    update(time, delta) {
        let cursors = this.input.keyboard.createCursorKeys();

        if (this.selector.frames_since_move === 0) {
            if (cursors.left.isDown) {
                this.selector.x -= 16;
            } else if (cursors.right.isDown) {
                this.selector.x += 16;
            }

            if (cursors.up.isDown) {
                this.selector.y -= 16;
            } else if (cursors.down.isDown) {
                this.selector.y += 16;
            }

            this.selector.frames_since_move = 3;
        } else {
            this.selector.frames_since_move -= 1;
        }

        let tileX = this.selector.x / 16;
        let tileY = this.selector.y / 16;
        let tile = this.belowLayer.getTileAt(tileX, tileY)

        let terrain = 'N/A'
        if (tile) {
            terrain = tile.properties['terrain']
        }

        eventDispatch.emit('update-terrain-panel', terrain, tileX, tileY)
    }
}

class TerrainPanel extends Phaser.Scene {
    constructor() {
        super('TerrainPanel');
        Phaser.Scene.call(this, {key: 'UIScene', active: true});
    }

    create() {
        this.text = this.add.text(
            16, 16,
            "hello world",
            {
                font: "18px monospace",
                fill: "#ffffff",
                padding: { x: 20, y: 10 },
                backgroundColor: "#000000"            }
        ).setScrollFactor(0);

        eventDispatch.on('update-terrain-panel', this.updatePanel, this)
    }

    updatePanel(terrain, x, y) {
        this.text.setText(`${terrain} @ (${x}, ${y})`)
    }
}


let config = {
    type: Phaser.AUTO,
    width: 900,
    height: 900,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: [MapScene, TerrainPanel],
    pixelArt: true
};

let game = new Phaser.Game(config);
