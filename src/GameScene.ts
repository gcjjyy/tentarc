import Game from '@/engine/Game';
import Scene from '@/engine/Scene';
import Image from '@/engine/Image';
import Sound from '@/engine/Sound';
import Sprite from '@/engine/Sprite';

export default class GameScene extends Scene {
    private img: Image;
    private bgm: Sound;

    constructor(game: Game) {
        super(game);

        // Load Image
        this.img = new Image(game, 'tileset.png');

        // Load Music
        this.bgm = new Sound(game, 'Beethoven_12_Variation.mp3');
    }

    public onPush = (): void => {
        console.log('GameScene push');

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
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
        console.log('GameScene pop');
    }

    public onMouseDown = (x: number, y: number): void => {
        this.game.popScene();
    }
}
