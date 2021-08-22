class TerrainPlate {
    constructor(scene, x, y) {
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.x = x;
        this.y = y;
        this.value = 100;
        this.p = 76 / 100;
        this.currentTile = null;
        this.draw();
        scene.add.existing(this.bar);
    }

    update(tile) {
        this.currentTile = tile;
        this.draw()
    }

    draw() {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 80, 16);

        //  Health
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);


        this.bar.fillStyle(0x00ff00);

        if (this.currentTile) {
            this.bar.setText(this.currentTile.properties['terrain'])
        } else {
            this.bar.setText('')
        }

        var d = Math.floor(this.p * this.value);
        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }
}