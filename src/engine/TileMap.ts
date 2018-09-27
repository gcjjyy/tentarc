import SceneObject from './SceneObject';
import TileSet from './TileSet';
import TileMapLayer from './TileMapLayer';

export default class TileMap extends SceneObject {
    private tileSets: TileSet[];
    private tileWidth: number;
    private tileHeight: number;
    private mapWidth: number;
    private mapHeight: number;
    private drawWidth: number;
    private drawHeight: number;
    private mapLayers: TileMapLayer[] = [];
    private collisionTypeData: number[] = [];

    constructor(mapWidth: number, mapHeight: number, tileWidth: number, tileHeight: number) {
        super(mapWidth * tileWidth, mapHeight * tileHeight);

        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.drawWidth = 0;
        this.drawHeight = 0;
        this.tileSets = [];
    }

    public addTileSet(tileSet: TileSet): TileMap {
        this.tileSets.push(tileSet);
        return this;
    }

    public getTileSets(): TileSet[] {
        return this.tileSets;
    }

    public setDrawSize(drawWidth: number, drawHeight: number): TileMap {
        this.drawWidth = drawWidth;
        this.drawHeight = drawHeight;
        return this;
    }

    public setDrawWidth(drawWidth: number): TileMap {
        this.drawWidth = drawWidth;
        return this;
    }

    public setDrawHeight(drawHeight: number): TileMap {
        this.drawHeight = drawHeight;
        return this;
    }

    public getDrawWidth(): number {
        return this.drawWidth;
    }

    public getDrawHeight(): number {
        return this.drawHeight;
    }

    public addLayer(layer: TileMapLayer, sortIndex: number = 0): TileMap {
        this.mapLayers.push(layer);
        this.addChild(layer).setSortIndex(sortIndex);
        return this;
    }

    public getLayer(name: string): TileMapLayer | null {
        for (const layer of this.mapLayers) {
            if (layer.getName() === name) {
                return layer;
            }
        }

        return null;
    }

    public setCollisionTypeData(data: number[]): TileMap {
        this.collisionTypeData = data;
        return this;
    }

    public getTilePositionTopLeft(x: number, y: number): any {
        const row = Math.floor(y / this.tileHeight);
        const col = Math.floor(x / this.tileWidth);

        return {
            x: col * this.tileWidth,
            y: row * this.tileHeight,
        };
    }

    public getTilePositionCenter(x: number, y: number): any {
        const row = Math.floor(y / this.tileHeight);
        const col = Math.floor(x / this.tileWidth);

        return {
            x: col * this.tileWidth + this.tileWidth / 2,
            y: row * this.tileHeight + this.tileHeight / 2,
        };
    }

    public getCollisionType(x: number, y: number): number {
        const row = Math.floor(y / this.tileHeight);
        const col = Math.floor(x / this.tileWidth);

        if (row >= 0 && col >= 0 && row < this.mapHeight && col < this.mapWidth) {
            return this.collisionTypeData[row * this.mapWidth + col];
        } else {
            return -1;
        }
    }
}
