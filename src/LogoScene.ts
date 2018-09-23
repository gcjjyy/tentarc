import Game from '@/engine/Game';
import Scene from '@/engine/Scene';
import Image from '@/engine/Image';
import Sound from '@/engine/Sound';
import DosFont from '@/engine/DosFont';
import Sprite from '@/engine/Sprite';
import Text from '@/engine/Text';
import GameScene from '@/GameScene';

export default class LogoScene extends Scene {
    private img: Image;
    private bgm: Sound;
    private fnt: DosFont;

    constructor(game: Game) {
        super(game);

        // Load Image
        this.img = new Image(game, 'tileset.png');

        // Load Music
        this.bgm = new Sound(game, 'Beethoven_12_Variation.mp3');

        this.fnt = new DosFont(game, 'HMDEF.ENG', 'H04.HAN');
    }

    public onShow = (): void => {
        console.log('LogoScene Show');

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

        this.addGameObject(new Text(this.fnt, 'ABCD1234abcd!!')).setPosition(0, 16);
        //this.addGameObject(new Text(this.fnt, 'Hello~! 반가워!')).setPosition(0, 32);
    }

    public onHide = (): void => {
        console.log('LogoScene Hide');
    }

    public onKeyDown = (key: string, keyCode: number): void => {
        console.log('LogoScene keydown: ' + key + '(' + keyCode + ')');
    }

    public onMouseDown = (x: number, y: number): void => {
        this.game.pushScene(new GameScene(this.game));
    }
}
