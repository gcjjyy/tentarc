import Game from '@/engine/Game';
import Scene from '@/engine/Scene';
import Image from '@/engine/Image';
import Sound from '@/engine/Sound';
import Sprite from '@/engine/Sprite';

export default class GameScene extends Scene {
    private img: Image;
    private bgm: Sound;

    private map: number[][];
    private keyCode: number = 0;

    constructor(game: Game) {
        super(game);

        // Load Image
        this.img = new Image(game, 'tileset.png');

        // Load Music
        this.bgm = new Sound(game, 'Beethoven_12_Variation.mp3');

        this.map = [];

        for (let i = 0; i < 64; i++) {
            this.map[i] = [];
            for (let j = 0; j < 64; j++) {
                this.map[i][j] = Math.floor((Math.random() * 128));
            }
        }
    }

    public onPush = (): void => {
        console.log('GameScene push');

        for (let i = 0; i < 64; i++) {
            for (let j = 0; j < 64; j++) {
                const go = this.addGameObject(
                    new Sprite(this.img,
                        Math.floor((this.map[i][j]) % 16) * 24,
                        Math.floor((this.map[i][j]) / 16) * 24,
                        24, 24).setPosition(24 * j, 24 * i));

                go.onMouseDown = (x: number, y: number) => {
                    const num = Math.floor(Math.random() * 128);
                    (go as Sprite).setSourceX((num % 16) * 24);
                    (go as Sprite).setSourceY((num / 16) * 24);
                };
            }
        }
    }

    public onPop = (): void => {
        console.log('GameScene pop');
    }

    public onUpdate = (): void => {
        switch (this.keyCode) {
            case 37: // Left
            this.setX(Math.min(this.getX() + 4, 0));
            break;

            case 38: // Up
            this.setY(Math.min(this.getY() + 4, 0));
            break;

            case 39: // Right
            this.setX(Math.max(this.getX() - 4, -64 * 24 + this.game.designedWidth));
            break;

            case 40: // Down
            this.setY(Math.max(this.getY() - 4, -64 * 24 + this.game.designedHeight));
            break;
        }
    }

    public onKeyDown = (key: string, keyCode: number): void => {
        this.keyCode = keyCode;
    }

    public onKeyUp = (key: string, keyCode: number): void => {
        this.keyCode = 0;
    }

    public onMouseDown = (x: number, y: number): void => {
        this.game.popScene();
    }
}
