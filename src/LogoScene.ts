import Game from '@/engine/Game';
import Scene from '@/engine/Scene';
import Image from '@/engine/Image';
import Sound from '@/engine/Sound';
import Sprite from '@/engine/Sprite';

export default class LogoScene extends Scene {
    private img: Image | null = null;
    private bgm: Sound | null = null;

    public onPush = (game: Game): void => {
        console.log('LogoScene push');

        // Load Image
        this.img = new Image(game, 'tileset.png');

        // Load Music
        this.bgm = new Sound(game, 'Beethoven_12_Variation.mp3');

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
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
        console.log('LogoScene pop');
    }
}
