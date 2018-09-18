import GameContext from './GameContext';
import GameObject from '@/gcjjyy/GameObject';

export default class Game {
    public onLoad: (() => void) | null = null;
    public onFrame: (() => void) | null = null;
    public onResize: ((width: number, height: number) => void) | null = null;

    constructor() {
        GameContext.instance.currentGame = this;
        GameContext.instance.sceneRoot = new GameObject(0, 0);
    }
}
