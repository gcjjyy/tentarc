import Screen from './Screen';
import SceneObject from './SceneObject';
import Font from './Font';

export default class Text extends SceneObject {
    private font: Font;
    private text: string;
    private fontColor: string;
    private lineHeight: number = 1;

    constructor(font: Font, text: string, fontColor: string = 'white', width: number = 0, height: number = 0) {
        super(width, height);

        this.font = font;
        this.text = text;
        this.fontColor = fontColor;
    }

    public setFontColor(fontColor: string): Text {
        this.fontColor = fontColor;
        return this;
    }

    public getFontColor(): string {
        return this.fontColor;
    }

    public setText(text: string): Text {
        this.text = text;
        return this;
    }

    public appendText(text: string): Text {
        this.text += text;
        return this;
    }

    public getText(): string {
        return this.text;
    }

    public setLineHeight(lineHeight: number): Text {
        this.lineHeight = lineHeight;
        return this;
    }

    public getLineHeight(): number {
        return this.lineHeight;
    }

    public onDraw = (screen: Screen): void => {

        let x: number = 0;
        let y: number = 0;

        for (const ch of this.text) {
            if (ch === '\n') {
                x = 0;
                y += this.font.getHeight() * this.lineHeight;
            } else {
                this.font.drawGlyph(this, screen, x, y, this.fontColor, ch);
                if (this.getWidth() === 0 || (x + this.font.getWidth(ch) < this.getWidth())) {
                    x += this.font.getWidth(ch);
                } else {
                    x = 0;
                    y += this.font.getHeight() * this.lineHeight;
                }
            }
        }
    }
}
