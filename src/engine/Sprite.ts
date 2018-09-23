import Game from './Game';
import GameObject from './GameObject';
import Image from './Image';
import Animation from './Animation';

export default class Sprite extends GameObject {
    private image: Image;
    private animations: Animation[] = [];
    private curAnimation: number = 0;

    constructor(image: Image) {
        super(0, 0);
        this.image = image;
    }

    public onUpdate = (dt: number): void => {
        this.animations[this.curAnimation].onUpdate(dt);
    }

    public onDraw = (game: Game, context2d: CanvasRenderingContext2D, scale: number): void => {
        const currentFrame = this.animations[this.curAnimation].getCurrentFrame();
        this.setWidth(currentFrame.getWidth());
        this.setHeight(currentFrame.getHeight());

        context2d.drawImage(
            this.image.getImageElement(),
            currentFrame.getX(), currentFrame.getY(),
            currentFrame.getWidth(), currentFrame.getHeight(),
            this.getAbsoluteX() * scale,
            this.getAbsoluteY() * scale,
            currentFrame.getWidth() * scale,
            currentFrame.getHeight() * scale);
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
