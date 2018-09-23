import Game from '@/engine/Game';
import Scene from '@/engine/Scene';
import Sprite from '@/engine/Sprite';
import TileMap from '@/engine/TileMap';
import TiledJsonLoader from '@/engine/TiledJsonLoader';
import SpriteJsonLoader from '@/engine/SpriteJsonLoader';

export default class GameScene extends Scene {
    private keyDown: boolean[] = [];
    private map: TileMap | null = null;
    private sprite: Sprite | null = null;

    constructor(game: Game) {
        super(game);

        TiledJsonLoader.load(game, './tilemap.json', (map: TileMap | null): void => {
            if (map) {
                this.addGameObject(map);
                this.map = map;
            }

            SpriteJsonLoader.load(this.game, 'hero.json', (sprite: Sprite | null): void => {
                this.sprite = sprite;
                if (sprite) {
                    this.addGameObject(sprite).setPosition(game.designedWidth / 2, game.designedHeight / 2);
                }
            });
        });
    }

    public onShow = (): void => {
        console.log('GameScene Show');
    }

    public onHide = (): void => {
        console.log('GameScene Hide');
    }

    public onUpdate = (dt: number): void => {
        if (this.map && this.sprite) {
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
        }
    }

    public onKeyDown = (key: string, keyCode: number): void => {
        this.keyDown[keyCode] = true;
    }

    public onKeyUp = (key: string, keyCode: number): void => {
        this.keyDown[keyCode] = false;
    }

    public onMouseDown = (x: number, y: number): void => {
        this.game.popScene();
    }
}
