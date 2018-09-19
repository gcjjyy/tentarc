import Game from './Game';
import Image from './Image';

export default class TileSet extends Image {
    private tileWidth: number;
    private tileHeight: number;

    constructor(game: Game, filename: string, tileWidth: number, tileHeight: number) {
        super(game, filename);

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }

    public getTileWidth(): number {
        return this.tileWidth;
    }

    public getTileHeight(): number {
        return this.tileHeight;
    }
}
