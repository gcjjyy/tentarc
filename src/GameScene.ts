import Game from '@/engine/Game';
import Scene from '@/engine/Scene';
import Sprite from '@/engine/Sprite';
import TileMap from '@/engine/TileMap';
import TiledJsonLoader from '@/engine/TiledJsonLoader';

export default class GameScene extends Scene {
    private keyDown: boolean[] = [];
    private map: TileMap | null = null;

    constructor(game: Game) {
        super(game);

        TiledJsonLoader.load(game, './map/sandbox.json', (map: TileMap | null): void => {
            if (map) {
                this.addGameObject(map);
                this.map = map;
            }
        });
    }

    public onShow = (): void => {
        console.log('GameScene Show');
    }

    public onHide = (): void => {
        console.log('GameScene Hide');
    }

    public onUpdate = (dt: number): void => {
        if (this.map) {
            if (this.keyDown[37]) {
                this.map.setX(this.map.getX() - 5);
            } else if (this.keyDown[38]) {
                this.map.setY(this.map.getY() - 5);
            } else if (this.keyDown[39]) {
                this.map.setX(this.map.getX() + 5);
            } else if (this.keyDown[40]) {
                this.map.setY(this.map.getY() + 5);
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
