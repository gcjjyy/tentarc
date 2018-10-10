import Screen from './Screen';
import Font from './Font';
import Image from './Image';
import SceneObject from './SceneObject';
import LocalFileLoader from './LocalFileLoader';

export default class ImageFont extends Font {
    public onGetWidth: ((ch: string, fontWidth: number) => number) | null = null;

    private image: Image;
    private fontWidth: number;
    private fontHeight: number;
    private columns: number = -1;
    private map: Map<string, number> = new Map<string, number>();

    constructor(imgFilename: string, charListFilename: string, fontWidth: number, fontHeight: number) {
        super();
        this.image = new Image(imgFilename);
        this.fontWidth = fontWidth;
        this.fontHeight = fontHeight;

        const loader = new LocalFileLoader();
        loader.loadAsText(charListFilename, (data: string | null): any => {
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    this.map.set(data[i], i);
                }
            }
        });
    }

    public getWidth = (ch: string): number => {
        if (this.onGetWidth) {
            return this.onGetWidth(ch, this.fontWidth);
        } else {
            return this.fontWidth;
        }
    }

    public getHeight = (): number => {
        return this.fontHeight;
    }

    public drawGlyph = (
        sender: SceneObject,
        screen: Screen,
        x: number,
        y: number,
        fontColor: string,
        ch: string): void => {

            const index = this.map.get(ch);
            if (index === undefined) {
                return;
            }

            screen.save();
            screen.multiplyColor(fontColor);

            /**
             * On constructor this.columns cannot be calculated.
             * So, the member varaible should be assigned when available.
             */
            if (this.columns < 0) {
                this.columns = Math.floor(this.image.getWidth() / this.fontWidth);
            }

            if (index !== undefined) {
                screen.drawImage(
                    sender,
                    this.image,
                    (index % this.columns) * this.fontWidth,
                    Math.floor(index / this.columns) * this.fontHeight,
                    this.fontWidth,
                    this.fontHeight,
                    x, y);


            screen.restore();
        }
    }
}
