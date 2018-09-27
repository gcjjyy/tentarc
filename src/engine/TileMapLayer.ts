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

        const parent: TileMap = this.getParent() as TileMap;

        if (parent) {
            const absX = this.getAbsoluteX();
            const absY = this.getAbsoluteY();
            const vpX = screen.getViewportX();
            const vpY = screen.getViewportY();
            const width = (parent.getDrawWidth() !== 0) ?
                parent.getDrawWidth() :
                Math.floor(screen.getDesignedWidth() / this.tileWidth);
            const height = (parent.getDrawHeight() !== 0) ?
                parent.getDrawHeight() :
                Math.floor(screen.getDesignedHeight() / this.tileHeight);

            const startX = Math.floor((vpX - absX) / this.tileWidth);
            const startY = Math.floor((vpY - absY) / this.tileHeight);
            const endX = startX + width + 2;
            const endY = startY + height + 2;

            const tileSets = parent.getTileSets();

            for (let i = startY; i < endY; i++) {
                for (let j = startX; j < endX; j++) {
                    if (i < 0 || j < 0 || i >= this.mapHeight || j >= this.mapWidth) {
                        continue;
                    }

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
                            Math.floor(tileNum % tileSets[tileSetIndex].getColumns()) * this.tileWidth,
                            Math.floor(tileNum / tileSets[tileSetIndex].getColumns()) * this.tileHeight,
                            this.tileWidth, this.tileHeight,
                            (absX + (j * this.tileWidth)),
                            (absY + (i * this.tileHeight)));
                    }
                }
            }
        }
    }
}
