import Screen from './Screen';
import SceneObject from './SceneObject';

/**
 * Important!!
 * -----------
 * 1. Do not call the set position and size methods.
 *    such as setX, setY, setWidth, setHeight.
 *    Because the position and size of the Scene will be used for picking objects.
 */
export default class Scene extends SceneObject {
    public onShow: (() => void) | null = null;
    public onHide: (() => void) | null = null;

    private screen: Screen;

    constructor(screen: Screen) {
        super(screen.getDesignedWidth(), screen.getDesignedHeight());
        this.screen = screen;
    }

    public addSceneObject(object: SceneObject): SceneObject {
        this.addChild(object);
        return object;
    }

    public getCurrentScreen(): Screen {
        return this.screen;
    }
}
