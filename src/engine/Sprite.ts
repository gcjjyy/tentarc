import Game from './Game';
import GameObject from './GameObject';
import Image from './Image';

export default class Sprite extends GameObject {
    private image: Image;
    private sx: number;
    private sy: number;

    constructor(game: Game, image: Image, sx: number, sy: number, width: number, height: number) {
        super(game, width, height);

        this.sx = sx;
        this.sy = sy;
        this.image = image;
    }

    public onDraw = (): void => {
        if (this.game && this.game.context2d) {
            this.game.context2d.drawImage(
                this.image.getImageElement(),
                this.sx, this.sy,
                this.getWidth(), this.getHeight(),
                this.getX() * this.game.scale,
                this.getY() * this.game.scale,
                this.getWidth() * this.game.scale,
                this.getHeight() * this.game.scale);
        }
    }
}
