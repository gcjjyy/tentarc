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

    public onDraw = (
        context2d: CanvasRenderingContext2D,
        designedWidth: number,
        designedHeight: number,
        scale: number): void => {

        let x: number = this.getAbsoluteX();
        let y: number = this.getAbsoluteY();

        for (const ch of this.text) {
            if (ch === '\n') {
                x = this.getAbsoluteX();
                y += this.font.getHeight();
            } else {
                this.font.drawGlyph(context2d, scale, x * scale, y * scale, ch);
                if (this.getWidth() === 0 ||
                    (x + this.font.getWidth(ch) < (this.getAbsoluteX() + this.getWidth()))) {
                    x += this.font.getWidth(ch);
                } else {
                    x = this.getAbsoluteX();
                    y += this.font.getHeight();
                }
            }
        }
    }
}
