import Screen from '@/engine/Screen';
import Scene from '@/engine/Scene';
import Image from '@/engine/Image';
import DosFont from '@/engine/DosFont';
import Sprite from '@/engine/Sprite';
import Text from '@/engine/Text';
import GameScene from '@/GameScene';
import Animation from '@/engine/Animation';
import Frame from '@/engine/Frame';

export default class LogoScene extends Scene {
    private img: Image;
    private chr: Image;
    private fnt: DosFont;
    private sprite: Sprite | null = null;

    constructor(game: Screen) {
        super(game);

        this.img = new Image('tileset.png');
        this.chr = new Image('character.png');
        this.fnt = new DosFont('HMDEF.ENG', 'H04.HAN');
    }

    public onShow = (): void => {
        this.sprite = new Sprite(this.chr);

        const anim1 = new Animation('walk-down', 1);
        anim1.addFrame(new Frame(0, 0, 16, 32));
        anim1.addFrame(new Frame(16, 0, 16, 32));
        anim1.addFrame(new Frame(32, 0, 16, 32));
        anim1.addFrame(new Frame(48, 0, 16, 32));

        const anim2 = new Animation('walk-right', 1);
        anim2.addFrame(new Frame(0, 32, 16, 32));
        anim2.addFrame(new Frame(16, 32, 16, 32));
        anim2.addFrame(new Frame(32, 32, 16, 32));
        anim2.addFrame(new Frame(48, 32, 16, 32));

        const anim3 = new Animation('walk-up', 1);
        anim3.addFrame(new Frame(0, 64, 16, 32));
        anim3.addFrame(new Frame(16, 64, 16, 32));
        anim3.addFrame(new Frame(32, 64, 16, 32));
        anim3.addFrame(new Frame(48, 64, 16, 32));

        const anim4 = new Animation('walk-left', 1);
        anim4.addFrame(new Frame(0, 96, 16, 32));
        anim4.addFrame(new Frame(16, 96, 16, 32));
        anim4.addFrame(new Frame(32, 96, 16, 32));
        anim4.addFrame(new Frame(48, 96, 16, 32));

        if (this.sprite) {
            this.sprite.addAnimation(anim1);
            this.sprite.addAnimation(anim2);
            this.sprite.addAnimation(anim3);
            this.sprite.addAnimation(anim4);

            this.addSceneObject(this.sprite).setPosition(64, 64);
        }

        this.addSceneObject(new Text(this.fnt, 'ABCD1234ab\ncd!!')).setPosition(0, 16);
        this.addSceneObject(new Text(this.fnt, 'Hello~! 반가워!', 'yellow', 48, 16)).setPosition(0, 48);
    }

    public onHide = (): void => {
        return;
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
        this.getCurrentScreen().pushScene(new GameScene(this.getCurrentScreen()));
    }
}
