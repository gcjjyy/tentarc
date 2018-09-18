import Game from '@/engine/Game';
import Scene from '@/engine/Scene';
import Image from '@/engine/Image';
import Sound from '@/engine/Sound';
import Sprite from '@/engine/Sprite';

export default class GameScene extends Scene {
    private img: Image | null;
    private bgm: Sound | null;

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
                if (this.img) {
                    const go = this.addGameObject(
                        new Sprite(this.img, 32 * j, 32 * i, 16, 16).setPosition(17 * j, 17 * i));

                    if (i !== j) {
                        go.onMouseDown = (x: number, y: number) => {
                            console.log('Index: (' + i + ', ' + j + ') offset: (' + x + ', ' + y + ')');
                        };
                    }
                }
            }
        }
    }

    public onPop = (): void => {
        console.log('GameScene pop');
    }
}
