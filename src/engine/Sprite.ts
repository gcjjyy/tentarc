import Game from './Game';
import GameObject from './GameObject';
import Image from './Image';
import Animation from './Animation';

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default class Sprite extends GameObject {
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

    public onDraw = (
        context2d: CanvasRenderingContext2D,
        designedWidth: number,
        designedHeight: number,
        scale: number): void => {

        if (this.animations.length > 0) {
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
        } else {
            context2d.drawImage(
                this.image.getImageElement(),
                this.rect.x, this.rect.y,
                this.rect.width, this.rect.height,
                this.getAbsoluteX() * scale,
                this.getAbsoluteY() * scale,
                this.rect.width * scale,
                this.rect.height * scale);
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
