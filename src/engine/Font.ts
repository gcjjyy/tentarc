import Screen from './Screen';
import Resource from './Resource';
import SceneObject from '@/engine/SceneObject';

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
        sender: SceneObject,
        screen: Screen,
        x: number,
        y: number,
        ch: string): void => {
            return;
        }
}
