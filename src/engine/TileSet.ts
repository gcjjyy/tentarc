import Screen from './Screen';
import Image from './Image';

export default class TileSet extends Image {
    private columns: number;
    private tileCount: number;

    constructor(filename: string, columns: number, tileCount: number) {
        super(filename);

        this.columns = columns;
        this.tileCount = tileCount;
    }

    public getColumns(): number {
        return this.columns;
    }

    public getTileCount(): number {
        return this.tileCount;
    }
}
