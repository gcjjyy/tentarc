import Game from './Game';
import GameObject from './GameObject';

export default class GameContext {
    public static currentGame: Game | null = null;
    public static canvas: HTMLCanvasElement | null = null;
    public static resources: HTMLDivElement | null = null;
    public static designedWidth: number = 0;
    public static designedHeight: number = 0;
    public static context2d: CanvasRenderingContext2D | null = null;
    public static scale: number = 1;
    public static sceneRoot: GameObject = new GameObject(0, 0);
}
