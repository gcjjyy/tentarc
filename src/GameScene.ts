import Game from '@/engine/Game';
import Scene from '@/engine/Scene';
import TileSet from '@/engine/TileSet';
import Sprite from '@/engine/Sprite';
import TileMap from '@/engine/TileMap';

export default class GameScene extends Scene {
    private tileSet: TileSet;

    private map: TileMap;
    private keyDown: boolean[] = [];

    constructor(game: Game) {
        super(game);

        // Load TileSet
        this.tileSet = new TileSet(this.game, 'tileset.png', 24, 24);
        this.map = new TileMap(this.tileSet, 64, 64);
    }

    public onShow = (): void => {
        console.log('GameScene Show');

        this.addGameObject(this.map).onMouseDown = (x: number, y: number) => {
            console.log('Clicked...');
        };
    }

    public onHide = (): void => {
        console.log('GameScene Hide');
    }

    public onUpdate = (dt: number): void => {
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
