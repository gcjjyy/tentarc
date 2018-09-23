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
        let xx: number = this.getAbsoluteX();
        let yy: number = this.getAbsoluteY();

        for (let i = 0; i < this.text.length; i++) {
            xx += (this.font.drawGlyph(game, context2d, scale, xx, yy, this.text.charCodeAt(i))) * scale;
        }
    }
}
