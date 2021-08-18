var config = {
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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


function preload() {
    this.load.image("cursor", "./assets/cursor.png");
    this.load.image("tiles", "./assets/tilesets/01003803-extruded.png");
    this.load.tilemapTiledJSON("map", "./assets/maps/1.json");

}

function create() {
    const map = this.make.tilemap({key: "map"});

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("01003803", "tiles", 16, 16, 1, 2);
    // const tileset = map.addTilesetImage("01003803", "tiles", 16, 16);

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);
    const closeE = map.createLayer("Close E", tileset, 0, 0);
    const destroyE = map.createLayer("Destroy E", tileset, 0, 0);
    const closeMiddle = map.createLayer("Close Middle", tileset, 0, 0);
    const destroyMiddle = map.createLayer("Destroy Middle", tileset, 0, 0);
    const closeW = map.createLayer("Close W", tileset, 0, 0);
    const destroyW = map.createLayer("Destroy W", tileset, 0, 0);

    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;
    camera.zoom = 2

    // Set up the arrows to control the camera
    const cursors = this.input.keyboard.createCursorKeys();

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Help text that has a "fixed" position on the screen
    this.add
        .text(16, 16, "Arrow keys to scroll", {
            font: "18px monospace",
            fill: "#ffffff",
            padding: {x: 20, y: 10},
            backgroundColor: "#000000"
        })
        .setScrollFactor(0);

    player = this.physics.add.sprite(16, 16, 'cursor');
    player.setOrigin(0, 0)
    player.setCollideWorldBounds(true);

    camera.startFollow(player)


    // this.add.image(400, 300, 'sky');
    //
    // platforms = this.physics.add.staticGroup();
    //
    // platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    //
    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');
    //
    // player = this.physics.add.sprite(100, 450, 'dude');
    // player.body.setGravityY(600)
    // player.setBounce(0.5);
    // player.setCollideWorldBounds(true);
    //
    // player.jumps_available = 2
    //
    // this.anims.create({
    //     key: 'left',
    //     frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    //     frameRate: 10,
    //     repeat: -1
    // });
    //
    // this.anims.create({
    //     key: 'turn',
    //     frames: [ { key: 'dude', frame: 4 } ],
    //     frameRate: 20
    // });
    //
    // this.anims.create({
    //     key: 'right',
    //     frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    //     frameRate: 10,
    //     repeat: -1
    // });
    //
    // this.physics.add.collider(player, platforms);
    //
    // stars = this.physics.add.group({
    //     key: 'star',
    //     repeat: 11,
    //     setXY: { x: 12, y: 0, stepX: 70 }
    // });
    //
    // stars.children.iterate(function (child) {
    //
    //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    //
    // });
    //
    // this.physics.add.collider(stars, platforms);
    // this.physics.add.overlap(player, stars, (player, star) => star.disableBody(true, true), null, this);
    player.frames_since_move = 0;
}


function update(time, delta) {
    cursors = this.input.keyboard.createCursorKeys();

    if (player.frames_since_move == 0) {
        if (cursors.left.isDown) {
            player.x -= 16;
        } else if (cursors.right.isDown) {
            player.x += 16;
        }

        if (cursors.up.isDown) {
            player.y -= 16;
        } else if (cursors.down.isDown) {
            player.y += 16;
        }

        player.frames_since_move = 5;
    } else {
        player.frames_since_move -= 1;
    }



    // Apply the controls to the camera each update tick of the game
    // controls.update(delta);
}

var game = new Phaser.Game(config);
