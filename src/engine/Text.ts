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
        let x: number = this.getAbsoluteX() * scale;
        let y: number = this.getAbsoluteY() * scale;

        for (let i = 0; i < this.text.length; i++) {
            x += (this.font.drawGlyph(game, context2d, scale, x, y, this.text.charCodeAt(i))) * scale;
        }
    }
}
