import Game from '@/engine/Game';
import Scene from '@/engine/Scene';
import TileSet from '@/engine/TileSet';
import Sprite from '@/engine/Sprite';
import TileMap from '@/engine/TileMap';

export default class GameScene extends Scene {
    private tileSet: TileSet;

    private map: TileMap;
    private keyCode: number = 0;

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

    public onMouseDown = (x: number, y: number): void => {
        this.game.popScene();
    }
}
