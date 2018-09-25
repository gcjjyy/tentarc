import Game from '@/engine/Game';
import GameObject from './GameObject';
import TileSet from './TileSet';
import TileMapLayer from './TileMapLayer';

export default class TileMap extends GameObject {
    private tileSets: TileSet[];
    private tileWidth: number;
    private tileHeight: number;
    private mapWidth: number;
    private mapHeight: number;
    private mapLayers: TileMapLayer[] = [];
    private collisionData: number[] = [];

    constructor(mapWidth: number, mapHeight: number, tileWidth: number, tileHeight: number) {
        super(mapWidth * tileWidth, mapHeight * tileHeight);

        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileSets = [];
    }

    public addTileSet(tileSet: TileSet): void {
        this.tileSets.push(tileSet);
    }

    public getTileSets(): TileSet[] {
        return this.tileSets;
    }

    public addLayer(layer: TileMapLayer, sortIndex: number = 0): void {
        this.mapLayers.push(layer);
        this.addChild(layer).setSortIndex(sortIndex);
    }

    public getLayer(name: string): TileMapLayer | null {
        for (const layer of this.mapLayers) {
            if (layer.getName() === name) {
                return layer;
            }
        }

        return null;
    }

    public setCollisionData(data: number[]): void {
        this.collisionData = data;
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

    public getCollisionData(x: number, y: number): number {
        const row = Math.trunc(y / this.tileHeight);
        const col = Math.trunc(x / this.tileWidth);

        if (row >= 0 && col >= 0 && row < this.mapHeight && col < this.mapWidth) {
            return this.collisionData[row * this.mapWidth + col];
        } else {
            return -1;
        }
    }
}
