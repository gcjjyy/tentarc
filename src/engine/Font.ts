import Game from './Game';
import Resource from './Resource';

export default class Font extends Resource {
    public drawGlyph = (
        game: Game,
        context2d: CanvasRenderingContext2D,
        scale: number,
        x: number,
        y: number,
        glyph: number): number => {
            return 0;
        }

    constructor(game: Game) {
        super();
    }
}
