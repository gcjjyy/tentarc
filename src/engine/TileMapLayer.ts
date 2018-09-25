import Game from './Game';
import TileMap from './TileMap';
import GameObject from './GameObject';

export default class TileMapLayer extends GameObject {
    private name: string;
    private tileWidth: number;
    private tileHeight: number;
    private mapWidth: number;
    private mapHeight: number;
    private mapData: number[];

    constructor(
        name: string,
        mapWidth: number,
        mapHeight: number,
        tileWidth: number,
        tileHeight: number,
        mapData: number[]) {

        super(mapWidth * tileWidth, mapHeight * tileHeight);

        this.name = name;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.mapData = mapData;
    }

    public getName(): string {
        return this.name;
    }

    public onDraw = (
        context2d: CanvasRenderingContext2D,
        designedWidth: number,
        designedHeight: number,
        scale: number): void => {

        const absX: number = this.getAbsoluteX();
        const absY: number = this.getAbsoluteY();

        // Get starting offset position
        const startX: number = Math.max(Math.trunc((absX * (-1)) / this.tileWidth), 0);
        const startY: number = Math.max(Math.trunc((absY * (-1)) / this.tileHeight), 0);
        const endX: number = Math.min(
            startX + Math.ceil(designedWidth / this.tileWidth) + 1,
            this.mapWidth);
        const endY: number = Math.min(
            startY + Math.ceil(designedHeight / this.tileHeight) + 1,
            this.mapHeight);

        if (this.getParent() instanceof TileMap) {

            const tileSets = (this.getParent() as TileMap).getTileSets();

            for (let i = startY; i < endY; i++) {
                for (let j = startX; j < endX; j++) {
                    let tileNum: number = this.mapData[i * this.mapWidth + j];
                    if (tileNum > 0) {
                        tileNum -= 1;

                        let tileSetIndex = 0;
                        for (const tileSet of tileSets) {
                            if (tileNum >= tileSet.getTileCount()) {
                                tileSetIndex++;
                                tileNum -= tileSet.getTileCount();
                            }
                        }

                        context2d.drawImage(
                            tileSets[tileSetIndex].getImageElement(),
                            Math.trunc(tileNum % tileSets[tileSetIndex].getColumns()) * this.tileWidth,
                            Math.trunc(tileNum / tileSets[tileSetIndex].getColumns()) * this.tileHeight,
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
