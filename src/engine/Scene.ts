import Game from './Game';
import GameObject from './GameObject';

export default class Scene extends GameObject {
    public onPush: (() => void) | null = null;
    public onPop: (() => void) | null = null;

    protected game: Game;

    constructor(game: Game, width: number, height: number) {
        super(width, height);
        this.game = game;
    }

    public addGameObject(object: GameObject): GameObject {
        this.addChild(object);
        return object;
    }
}
