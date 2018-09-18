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
        if (GameContext.context2d) {
            GameContext.context2d.drawImage(
                this.image.getImageElement(),
                this.sx, this.sy,
                this.getWidth(), this.getHeight(),
                this.getX() * GameContext.scale,
                this.getY() * GameContext.scale,
                this.getWidth() * GameContext.scale,
                this.getHeight() * GameContext.scale);
        }
    }
}
