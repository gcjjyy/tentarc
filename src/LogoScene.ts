import Game from '@/engine/Game';
import Scene from '@/engine/Scene';
import Image from '@/engine/Image';
import Sound from '@/engine/Sound';
import Sprite from '@/engine/Sprite';
import GameScene from '@/GameScene';

export default class LogoScene extends Scene {
    private img: Image;
    private bgm: Sound;

    constructor(game: Game, width: number, height: number) {
        super(game, width, height);

        // Load Image
        this.img = new Image(game, 'tileset.png');

        // Load Music
        this.bgm = new Sound(game, 'Beethoven_12_Variation.mp3');
    }

    public onPush = (): void => {
        console.log('LogoScene push');

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const go = this.addGameObject(
                    new Sprite(this.img, 24 * j, 24 * i, 24, 24).setPosition(25 * j, 25 * i));

                if (i !== j) {
                    go.onMouseDown = (x: number, y: number) => {
                        console.log('Index: (' + i + ', ' + j + ') offset: (' + x + ', ' + y + ')');
                    };
                }
            }
        }
    }

    public onPop = (): void => {
        console.log('LogoScene pop');
    }

    public onKeyDown = (key: string, keyCode: number): void => {
        console.log('LogoScene keydown: ' + key + '(' + keyCode + ')');
    }

    public onMouseDown = (x: number, y: number): void => {
        this.game.pushScene(new GameScene(this.game, 64 * 24, 64 * 24));
    }
}
