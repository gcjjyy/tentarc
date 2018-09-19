import GameObject from './GameObject';
import TileSet from './TileSet';

export default class TileMap extends GameObject {
    private tileSet: TileSet;
    private mapWidth: number;
    private mapHeight: number;
    private mapData: number[][];

    constructor(tileSet: TileSet, mapWidth: number, mapHeight: number) {
        super(mapWidth * tileSet.getTileWidth(), mapHeight * tileSet.getTileHeight());

        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.tileSet = tileSet;

        this.mapData = [];

        // Dummy data for testing
        for (let i = 0; i < this.mapHeight; i++) {
            this.mapData[i] = [];
            for (let j = 0; j < this.mapWidth; j++) {
                this.mapData[i][j] = Math.floor((Math.random() * 128));
            }
        }
    }

    public onDraw = (context2d: CanvasRenderingContext2D, scale: number): void => {
        const tileWidth: number = this.tileSet.getTileWidth();
        const tileHeight: number = this.tileSet.getTileHeight();

        const tileCountInRow: number = Math.floor(this.tileSet.getWidth() / tileWidth);
        const absX: number = this.getAbsoluteX();
        const absY: number = this.getAbsoluteY();

        // Get starting offset position
        const startX: number = Math.max(Math.floor((absX * (-1)) / tileWidth), 0);
        const startY: number = Math.max(Math.floor((absY * (-1)) / tileHeight), 0);
        const endX: number = Math.min(
            startX + Math.ceil(context2d.canvas.clientWidth / tileWidth) + 1,
            this.mapWidth);
        const endY: number = Math.min(
            startY + Math.ceil(context2d.canvas.clientHeight / tileHeight) + 1,
            this.mapHeight);

        for (let i = startY; i < endY; i++) {
            for (let j = startX; j < endX; j++) {
                const tileNum: number = this.mapData[i][j];
                context2d.drawImage(
                    this.tileSet.getImageElement(),
                    (tileNum % tileCountInRow) * tileWidth,
                    (tileNum / tileCountInRow) * tileHeight,
                    tileWidth, tileHeight,
                    (absX + (j * tileWidth)) * scale,
                    (absY + (i * tileHeight)) * scale,
                    tileWidth * scale,
                    tileHeight * scale);
            }
        }
    }
}
