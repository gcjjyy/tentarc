import Screen from './Screen';
import SceneObject from './SceneObject';
import Image from './Image';
import Animation from './Animation';
import Rect from './Rect';

export default class Sprite extends SceneObject {
    private image: Image;
    private animations: Animation[] = [];
    private curAnimation: number = 0;
    private rect: Rect = {x: 0, y: 0, width: 0, height: 0};

    constructor(image: Image) {
        super(0, 0);
        this.image = image;
    }

    public onUpdate = (dt: number): void => {
        if (this.animations.length > 0) {
            this.animations[this.curAnimation].onUpdate(dt);
        }
    }

    public onDraw = (screen: Screen): void => {

        if (this.animations.length > 0) {
            const currentFrame = this.animations[this.curAnimation].getCurrentFrame();
            this.setWidth(currentFrame.getWidth());
            this.setHeight(currentFrame.getHeight());

            screen.drawImage(
                this.image,
                currentFrame.getX(), currentFrame.getY(),
                currentFrame.getWidth(), currentFrame.getHeight(),
                this.getAbsoluteX(),
                this.getAbsoluteY());
        } else {
            screen.drawImage(
                this.image,
                this.rect.x, this.rect.y,
                this.rect.width, this.rect.height,
                this.getAbsoluteX(),
                this.getAbsoluteY());
        }
    }

    public setRect(x: number, y: number, width: number, height: number): void {
        this.rect.x = x;
        this.rect.y = y;
        this.rect.width = width;
        this.rect.height = height;
    }

    public addAnimation(anim: Animation): void {
        this.animations.push(anim);
    }

    public setAnimation(anim: number | string): void {
        if (typeof anim === 'number') {
            this.curAnimation = anim;
        } else if (typeof anim === 'string') {
            this.curAnimation = 0;
        }
    }

    public getCurrentAnimation(): number {
        return this.curAnimation;
    }
}
