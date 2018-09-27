import Screen from '@/engine/Screen';
import Scene from '@/engine/Scene';
import Image from '@/engine/Image';
import Audio from '@/engine/Audio';
import Sprite from '@/engine/Sprite';
import Text from '@/engine/Text';
import DosFont from '@/engine/DosFont';
import TileMap from '@/engine/TileMap';
import TiledJsonLoader from '@/engine/TiledJsonLoader';
import SpriteJsonLoader from '@/engine/SpriteJsonLoader';
import Plane from '@/engine/Plane';

export default class GameScene extends Scene {
    private keyDown: boolean[] = [];
    private map: TileMap | null = null;
    private sprite: Sprite | null = null;
    private npc: Sprite | null = null;
    private talk: Plane | null = null;
    private fnt: DosFont;
    private bgm: Audio;
    private step: Audio;
    private stepCount: number = 1;

    constructor(game: Screen) {
        super(game);

        this.fnt = new DosFont('HMDEF.ENG', 'H04.HAN');

        this.bgm = new Audio('./hotel.mp3');
        this.bgm.play(0.25);

        this.step = new Audio('./ui-sound-14.ogg');

        TiledJsonLoader.load('./tilemap.json', (map: TileMap | null): void => {
            if (map) {
                this.addSceneObject(map);
                this.map = map;

                const ground = this.map.getLayer('ground');
                if (ground) {
                    ground.setSortIndex(0);
                }

                const objectUnderCharacter = this.map.getLayer('object_under_character');
                if (objectUnderCharacter) {
                    objectUnderCharacter.setSortIndex(1);
                }

                const objectOverCharacter = this.map.getLayer('object_over_character');
                if (objectOverCharacter) {
                    objectOverCharacter.setSortIndex(3);
                }

                map.setDrawSize(16, 16);
                this.addSceneObject(new Plane(480 - 16 * 16, 270, 'black'))
                    .setX(16 * 17)
                    .setPinned(true)
                    .setSortIndex(10);
            }
        });

        SpriteJsonLoader.load('hero.json', (sprite: Sprite | null): void => {
            this.sprite = sprite;
            if (sprite) {
                this.addSceneObject(sprite)
                    .setPosition(this.getWidth() / 2, this.getHeight() / 2)
                    .setSortIndex(2);
            }
        });

        SpriteJsonLoader.load('npc.json', (sprite: Sprite | null): void => {
            this.npc = sprite;
            if (sprite) {
                this.addSceneObject(sprite)
                    .setPosition(this.getWidth() / 2 + 64, this.getHeight() / 2 + 64)
                    .setSortIndex(2);
            }
        });

        this.talk = new Plane(240, 96, '#00000080');
        this.talk.setPosition(16, 16);
        this.talk.setPinned(true);

        this.addSceneObject(this.talk).setPosition(16, 16).setSortIndex(20).addChild(
            new Text(this.fnt, '[장경돌]\n안녕하세용~ 저는 장경돌 입니다^^;; 반갑습니다.\n 여러분의 성원에 힘입어 이렇게 게임을 만들게 되었습니다. 가나다라마바사아자차카타파하 에헤 우헤우헤우허허 하고싶은 말들은 너무너무 많은데.', 'white')
                .setScale(0.5)
                .setPosition(32, 32)
                .setSize(416, 128)
        );
        this.talk.setVisible(false);
    }

    public onShow = (): void => {
        return;
    }

    public onHide = (): void => {
        return;
    }

    public onUpdate = (dt: number): void => {
        if (this.map && this.sprite) {
            const oldX = this.sprite.getX();
            const oldY = this.sprite.getY();

            if (this.keyDown[37]) {
                this.sprite.setX(oldX - 2);
                this.sprite.setAnimation(3);
                this.stepCount--;
            } else if (this.keyDown[38]) {
                this.sprite.setY(oldY - 2);
                this.sprite.setAnimation(2);
                this.stepCount--;
            } else if (this.keyDown[39]) {
                this.sprite.setX(oldX + 2);
                this.sprite.setAnimation(1);
                this.stepCount--;
            } else if (this.keyDown[40]) {
                this.sprite.setY(oldY + 2);
                this.sprite.setAnimation(0);
                this.stepCount--;
            } else {
                this.stepCount = 1;
            }

            if (this.stepCount <= 0) {
                this.step.play();
                this.stepCount = 24;
            }

            if (this.map.getCollisionType(this.sprite.getX() + 2, this.sprite.getY() + 18) !== 0 ||
                this.map.getCollisionType(this.sprite.getX() + 14, this.sprite.getY() + 18) !== 0 ||
                this.map.getCollisionType(this.sprite.getX() + 2, this.sprite.getY() + 30) !== 0 ||
                this.map.getCollisionType(this.sprite.getX() + 14, this.sprite.getY() + 30) !== 0) {
                this.sprite.setX(oldX);
                this.sprite.setY(oldY);
            }

            this.getCurrentScreen().setViewportX(this.sprite.getGlobalX() - 128);
            this.getCurrentScreen().setViewportY(this.sprite.getGlobalY() - 128);
        }
    }

    public onKeyDown = (key: string, keyCode: number): void => {
        this.keyDown[keyCode] = true;

        if (keyCode === 32) {
            if (this.talk) {
                this.talk.setVisible(!this.talk.getVisible());
            }
        }
    }

    public onKeyUp = (key: string, keyCode: number): void => {
        this.keyDown[keyCode] = false;
    }

    public onMouseDown = (x: number, y: number): void => {
        this.getCurrentScreen().popScene();
    }
}
