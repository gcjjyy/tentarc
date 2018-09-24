import Game from './Game';
import GameObject from './GameObject';

/**
 * Important!!
 * -----------
 * 1. Do not call the set position and size methods.
 *    such as setX, setY, setWidth, setHeight.
 *    Because the position and size of the Scene will be used for picking objects.
 */
export default class Scene extends GameObject {
    public onShow: (() => void) | null = null;
    public onHide: (() => void) | null = null;

    private game: Game;

    constructor(game: Game) {
        super(game.designedWidth, game.designedHeight);
        this.game = game;
    }

    public addGameObject(object: GameObject): GameObject {
        this.addChild(object);
        return object;
    }

    public getCurrentGame(): Game {
        return this.game;
    }
}
