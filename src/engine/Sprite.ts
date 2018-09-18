import Game from './Game';
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
        if (Game.context2d) {
            Game.context2d.drawImage(
                this.image.getImageElement(),
                this.sx, this.sy,
                this.getWidth(), this.getHeight(),
                this.getX() * Game.scale,
                this.getY() * Game.scale,
                this.getWidth() * Game.scale,
                this.getHeight() * Game.scale);
        }
    }
}
