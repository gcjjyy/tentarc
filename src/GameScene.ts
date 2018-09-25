import Game from '@/engine/Game';
import Scene from '@/engine/Scene';
import Sound from '@/engine/Sound';
import Sprite from '@/engine/Sprite';
import TileMap from '@/engine/TileMap';
import TiledJsonLoader from '@/engine/TiledJsonLoader';
import SpriteJsonLoader from '@/engine/SpriteJsonLoader';
import TileMapLayer from '@/engine/TileMapLayer';

export default class GameScene extends Scene {
    private keyDown: boolean[] = [];
    private map: TileMap | null = null;
    private sprite: Sprite | null = null;
    private bgm: Sound;

    constructor(game: Game) {
        super(game);

        this.bgm = new Sound();
        // this.bgm.play('./Beethoven_12_Variation.mp3');

        TiledJsonLoader.load('./tilemap.json', (map: TileMap | null): void => {
            if (map) {
                this.addGameObject(map);
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
            }
        });

        SpriteJsonLoader.load('hero.json', (sprite: Sprite | null): void => {
            this.sprite = sprite;
            if (sprite) {
                this.addGameObject(sprite)
                    .setPosition(this.getWidth() / 2, this.getHeight() / 2)
                    .setSortIndex(2);
            }
        });
    }

    public onShow = (): void => {
        return;
    }

    public onHide = (): void => {
        return;
    }

    public onUpdate = (dt: number): void => {
        if (this.map && this.sprite) {
            const oldX = this.map.getX();
            const oldY = this.map.getY();

            if (this.keyDown[37]) {
                this.map.setX(this.map.getX() + 2);
                this.sprite.setAnimation(3);
            } else if (this.keyDown[38]) {
                this.map.setY(this.map.getY() + 2);
                this.sprite.setAnimation(2);
            } else if (this.keyDown[39]) {
                this.map.setX(this.map.getX() - 2);
                this.sprite.setAnimation(1);
            } else if (this.keyDown[40]) {
                this.map.setY(this.map.getY() - 2);
                this.sprite.setAnimation(0);
            }

            if (this.map.getCollisionType(this.map.getX() * -1 + 240, this.map.getY() * -1 + 154) !== 0 ||
                this.map.getCollisionType(this.map.getX() * -1 + 256, this.map.getY() * -1 + 154) !== 0 ||
                this.map.getCollisionType(this.map.getX() * -1 + 240, this.map.getY() * -1 + 163) !== 0 ||
                this.map.getCollisionType(this.map.getX() * -1 + 256, this.map.getY() * -1 + 163) !== 0) {
                this.map.setX(oldX);
                this.map.setY(oldY);
            }
        }
    }

    public onKeyDown = (key: string, keyCode: number): void => {
        this.keyDown[keyCode] = true;
    }

    public onKeyUp = (key: string, keyCode: number): void => {
        this.keyDown[keyCode] = false;
    }

    public onMouseDown = (x: number, y: number): void => {
        this.getCurrentGame().popScene();
    }
}
