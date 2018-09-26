import Screen from './Screen';
import TileMap from './TileMap';
import SceneObject from './SceneObject';

export default class TileMapLayer extends SceneObject {
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

    public onDraw = (screen: Screen): void => {

        const absX: number = this.getAbsoluteX();
        const absY: number = this.getAbsoluteY();

        if (this.getParent() instanceof TileMap) {

            const tileSets = (this.getParent() as TileMap).getTileSets();

            for (let i = 0; i < this.mapHeight; i++) {
                for (let j = 0; j < this.mapWidth; j++) {
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

                        screen.drawImage(
                            tileSets[tileSetIndex],
                            Math.trunc(tileNum % tileSets[tileSetIndex].getColumns()) * this.tileWidth,
                            Math.trunc(tileNum / tileSets[tileSetIndex].getColumns()) * this.tileHeight,
                            this.tileWidth, this.tileHeight,
                            (absX + (j * this.tileWidth)),
                            (absY + (i * this.tileHeight)));
                    }
                }
            }
        }
    }
}
