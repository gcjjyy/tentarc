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

    private offscreenElement: HTMLCanvasElement;
    private offscreen: CanvasRenderingContext2D | null = null;

    constructor(imgFilename: string, charListFilename: string, fontWidth: number, fontHeight: number) {
        super();
        this.image = new Image(imgFilename);
        this.fontWidth = fontWidth;
        this.fontHeight = fontHeight;

        this.offscreenElement = document.createElement('canvas');
        this.offscreenElement.width = this.fontWidth;
        this.offscreenElement.height = this.fontHeight;
        this.offscreen = this.offscreenElement.getContext('2d');

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

        /**
         * On constructor this.columns cannot be calculated.
         * So, the member varaible should be assigned when available.
         */
        if (this.columns < 0) {
            this.columns = Math.floor(this.image.getWidth() / this.fontWidth);
        }

        if (index !== undefined) {

            if (this.offscreen) {
                this.offscreen.globalCompositeOperation = 'source-over';
                this.offscreen.fillStyle = fontColor;
                this.offscreen.fillRect(0, 0, this.fontWidth, this.fontHeight);
                this.offscreen.globalCompositeOperation = 'destination-atop';
                this.offscreen.drawImage(
                    this.image.getImageElement(),
                    (index % this.columns) * this.fontWidth,
                    Math.floor(index / this.columns) * this.fontHeight,
                    this.fontWidth,
                    this.fontHeight,
                    0, 0,
                    this.fontWidth,
                    this.fontHeight);
            }

            screen.drawCanvas(
                sender,
                this.offscreenElement,
                0, 0,
                this.fontWidth,
                this.fontHeight,
                x, y);
        }
    }
}
