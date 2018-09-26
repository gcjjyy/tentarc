import Screen from './Screen';
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
        screen: Screen,
        x: number,
        y: number,
        ch: string): void => {
            return;
        }
}
