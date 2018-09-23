import Game from '@/engine/Game';
import Scene from '@/engine/Scene';
import Image from '@/engine/Image';
import Sound from '@/engine/Sound';
import DosFont from '@/engine/DosFont';
import Sprite from '@/engine/Sprite';
import Text from '@/engine/Text';
import GameScene from '@/GameScene';
import SpriteJsonLoader from '@/engine/SpriteJsonLoader';
import Animation from '@/engine/Animation';
import Frame from '@/engine/Frame';

export default class LogoScene extends Scene {
    private img: Image;
    private chr: Image;
    private bgm: Sound;
    private fnt: DosFont;
    private sprite: Sprite | null = null;

    constructor(game: Game) {
        super(game);

        this.img = new Image(game, 'tileset.png');
        this.chr = new Image(game, 'character.png');
        this.bgm = new Sound(game, 'Beethoven_12_Variation.mp3');
        this.fnt = new DosFont(game, 'HMDEF.ENG', 'H04.HAN');
    }

    public onShow = (): void => {
        console.log('LogoScene Show');
/*
        this.sprite = new Sprite(this.chr);

        const anim1 = new FrameAnimation('walk-down', 1);
        anim1.addFrame(new Frame(0, 0, 16, 32));
        anim1.addFrame(new Frame(16, 0, 16, 32));
        anim1.addFrame(new Frame(32, 0, 16, 32));
        anim1.addFrame(new Frame(48, 0, 16, 32));

        const anim2 = new FrameAnimation('walk-right', 1);
        anim2.addFrame(new Frame(0, 32, 16, 32));
        anim2.addFrame(new Frame(16, 32, 16, 32));
        anim2.addFrame(new Frame(32, 32, 16, 32));
        anim2.addFrame(new Frame(48, 32, 16, 32));

        const anim3 = new FrameAnimation('walk-up', 1);
        anim3.addFrame(new Frame(0, 64, 16, 32));
        anim3.addFrame(new Frame(16, 64, 16, 32));
        anim3.addFrame(new Frame(32, 64, 16, 32));
        anim3.addFrame(new Frame(48, 64, 16, 32));

        const anim4 = new FrameAnimation('walk-left', 1);
        anim4.addFrame(new Frame(0, 96, 16, 32));
        anim4.addFrame(new Frame(16, 96, 16, 32));
        anim4.addFrame(new Frame(32, 96, 16, 32));
        anim4.addFrame(new Frame(48, 96, 16, 32));

        if (this.sprite) {
            this.sprite.addAnimation(anim1);
            this.sprite.addAnimation(anim2);
            this.sprite.addAnimation(anim3);
            this.sprite.addAnimation(anim4);
        }
*/

        SpriteJsonLoader.load(this.game, 'hero.json', (sprite: Sprite | null): void => {
            this.sprite = sprite;
            if (sprite) {
                this.addGameObject(sprite).setPosition(64, 64);
            }
        });

        this.addGameObject(new Text(this.fnt, 'ABCD1234ab\ncd!!')).setPosition(0, 16);
        this.addGameObject(new Text(this.fnt, 'Hello~! 반가워!', 48, 16)).setPosition(0, 48);
    }

    public onHide = (): void => {
        console.log('LogoScene Hide');
    }

    public onKeyDown = (key: string, keyCode: number): void => {
        if (this.sprite) {
            if (this.sprite.getCurrentAnimation() === 3) {
                this.sprite.setAnimation(0);
            } else {
                this.sprite.setAnimation(this.sprite.getCurrentAnimation() + 1);
            }
        }
    }

    public onMouseDown = (x: number, y: number): void => {
        this.game.pushScene(new GameScene(this.game));
    }
}
