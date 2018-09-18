import Game from './Game';
import GameObject from './GameObject';

export default class GameContext {
    private static inst: GameContext | null = null;

    public currentGame: Game | null = null;
    public canvas: HTMLCanvasElement | null = null;
    public resources: HTMLDivElement | null = null;
    public designedWidth: number = 0;
    public designedHeight: number = 0;
    public context2d: CanvasRenderingContext2D | null = null;
    public scale: number = 1;
    public sceneRoot: GameObject = new GameObject(0, 0);

    private constructor() {

    }

    public static get instance() {
        return this.inst || (this.inst = new this());
    }
}
