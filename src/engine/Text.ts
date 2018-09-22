import Game from './Game';
import GameObject from './GameObject';
import Font from './Font';

export default class Text extends GameObject {
    private font: Font;
    private text: string;

    constructor(font: Font, text: string, width: number = 0, height: number = 0) {
        super(width, height);

        this.font = font;
        this.text = text;
    }

    public onDraw = (game: Game, context2d: CanvasRenderingContext2D, scale: number): void => {

    }
}
