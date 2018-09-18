import GameContext from './GameContext';
import GameObject from './GameObject';
import Image from './Image';

export default class Sprite extends GameObject {
    private image: Image;
    private sx: number;
    private sy: number;

    constructor(image: Image, sx: number, sy: number, width: number, height: number) {
        super(width, height);

        this.sx = sx;
        this.sy = sy;
        this.image = image;
    }

    public onDraw = (): void => {
        if (GameContext.instance.context2d) {
            GameContext.instance.context2d.drawImage(
                this.image.getImageElement(),
                this.sx, this.sy,
                this.getWidth(), this.getHeight(),
                this.getX() * GameContext.instance.scale,
                this.getY() * GameContext.instance.scale,
                this.getWidth() * GameContext.instance.scale,
                this.getHeight() * GameContext.instance.scale);
        }
    }
}
