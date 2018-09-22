import Game from './Game';
import Image from './Image';

export default class TileSet extends Image {
    private columns: number;
    private tileCount: number;

    constructor(game: Game, filename: string, columns: number, tileCount: number) {
        super(game, filename);

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
