import GameObject from './GameObject';
import TileSet from './TileSet';
import Game from '@/engine/Game';

export default class TileMap extends GameObject {
    private tileSets: TileSet[];
    private tileWidth: number;
    private tileHeight: number;
    private mapWidth: number;
    private mapHeight: number;
    private mapData: number[][][];

    constructor(mapWidth: number, mapHeight: number, tileWidth: number, tileHeight: number) {
        super(mapWidth * tileWidth, mapHeight * tileHeight);

        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileSets = [];
        this.mapData = [];
    }

    public addTileSet(tileSet: TileSet): void {
        this.tileSets.push(tileSet);
    }

    public addLayer(layerData: number[][]): void {
        this.mapData.push(layerData);
    }

    public getTilePositionTopLeft(x: number, y: number): any {
        const row = Math.trunc(y / this.tileHeight);
        const col = Math.trunc(x / this.tileWidth);

        return {
            x: col * this.tileWidth,
            y: row * this.tileHeight,
        };
    }

    public getTilePositionCenter(x: number, y: number): any {
        const row = Math.trunc(y / this.tileHeight);
        const col = Math.trunc(x / this.tileWidth);

        return {
            x: col * this.tileWidth + this.tileWidth / 2,
            y: row * this.tileHeight + this.tileHeight / 2,
        };
    }

    public onDraw = (game: Game, context2d: CanvasRenderingContext2D, scale: number): void => {
        const absX: number = this.getAbsoluteX();
        const absY: number = this.getAbsoluteY();

        // Get starting offset position
        const startX: number = Math.max(Math.trunc((absX * (-1)) / this.tileWidth), 0);
        const startY: number = Math.max(Math.trunc((absY * (-1)) / this.tileHeight), 0);
        const endX: number = Math.min(
            startX + Math.ceil(game.designedWidth / this.tileWidth) + 1,
            this.mapWidth);
        const endY: number = Math.min(
            startY + Math.ceil(game.designedHeight / this.tileHeight) + 1,
            this.mapHeight);

        for (const layerData of this.mapData) {
            for (let i = startY; i < endY; i++) {
                for (let j = startX; j < endX; j++) {
                    let tileNum: number = layerData[i][j];
                    if (tileNum > 0) {
                        tileNum -= 1;

                        let tileSetIndex = 0;
                        for (const tileSet of this.tileSets) {
                            if (tileNum >= tileSet.getTileCount()) {
                                tileSetIndex++;
                                tileNum -= tileSet.getTileCount();
                            }
                        }

                        context2d.drawImage(
                            this.tileSets[tileSetIndex].getImageElement(),
                            Math.trunc(tileNum % this.tileSets[tileSetIndex].getColumns()) * this.tileWidth,
                            Math.trunc(tileNum / this.tileSets[tileSetIndex].getColumns()) * this.tileHeight,
                            this.tileWidth, this.tileHeight,
                            (absX + (j * this.tileWidth)) * scale,
                            (absY + (i * this.tileHeight)) * scale,
                            this.tileWidth * scale,
                            this.tileHeight * scale);
                    }
                }
            }
        }
    }
}
