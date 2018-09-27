import Screen from './Screen';
import SceneObject from './SceneObject';
import Font from './Font';

export default class Text extends SceneObject {
    private font: Font;
    private text: string;

    constructor(font: Font, text: string, width: number = 0, height: number = 0) {
        super(width, height);

        this.font = font;
        this.text = text;
    }

    public onDraw = (screen: Screen): void => {

        let x: number = 0;
        let y: number = 0;

        for (const ch of this.text) {
            if (ch === '\n') {
                x = 0;
                y += this.font.getHeight();
            } else {
                this.font.drawGlyph(this, screen, x, y, ch);
                if (this.getWidth() === 0 || (x + this.font.getWidth(ch) < this.getWidth())) {
                    x += this.font.getWidth(ch);
                } else {
                    x = 0;
                    y += this.font.getHeight();
                }
            }
        }
    }
}
