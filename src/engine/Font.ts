import Resource from './Resource';

export default class Font extends Resource {
    constructor() {
        super();
    }

    public getWidth = (ch: string): number => {
        return 0;
    }

    public getHeight = (): number => {
        return 0;
    }

    public drawGlyph = (
        context2d: CanvasRenderingContext2D,
        scale: number,
        x: number,
        y: number,
        ch: string): void => {
            return;
        }
}
