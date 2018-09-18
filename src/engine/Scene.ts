import Game from './Game';
import GameObject from './GameObject';

export default class Scene extends GameObject {
    public onPush: (() => void) | null = null;
    public onPop: (() => void) | null = null;

    protected game: Game | null = null;

    constructor(game: Game) {
        super(game.designedWidth, game.designedHeight);

        this.game = game;
    }

    public addGameObject(object: GameObject): GameObject {
        this.addChild(object);
        return object;
    }
}
