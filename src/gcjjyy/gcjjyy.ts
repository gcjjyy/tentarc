import GameContext from './GameContext';
import Game from './Game';
import GameObject from './GameObject';

function gameLoop(): void {
    requestAnimationFrame(gameLoop);

    if (GameContext.instance.context2d) {
        GameContext.instance.context2d.fillStyle = 'black';
        GameContext.instance.context2d.fill();

        GameContext.instance.context2d.save();

        GameContext.instance.sceneRoot.draw();

        GameContext.instance.context2d.restore();
    }

    if (GameContext.instance.currentGame && GameContext.instance.currentGame.onFrame) {
        GameContext.instance.currentGame.onFrame();
    }
}

function recalcScreenSize(width: number, height: number): void {
    GameContext.instance.scale = Math.min(
        Math.floor(window.innerWidth / width),
        Math.floor(window.innerHeight / height));

    if (GameContext.instance.scale < 1) {
        GameContext.instance.scale = 1;
    }

    if (GameContext.instance.context2d) {
        GameContext.instance.context2d.canvas.width = width * GameContext.instance.scale;
        GameContext.instance.context2d.canvas.height = height * GameContext.instance.scale;
        GameContext.instance.context2d.imageSmoothingEnabled = false;

        // Below is for IE11
        eval('document.getElementById("canvas").getContext("2d").msImageSmoothingEnabled = false;');
    }

    GameContext.instance.sceneRoot.setWidth(width);
    GameContext.instance.sceneRoot.setHeight(height);
}

export function setDesignedScreenSize(designedWidth: number, designedHeight: number): void {
    GameContext.instance.designedWidth = designedWidth;
    GameContext.instance.designedHeight = designedHeight;
    recalcScreenSize(GameContext.instance.designedWidth, GameContext.instance.designedHeight);
}

export function addGameObject(object: GameObject): GameObject {
    object.setParent(GameContext.instance.sceneRoot);
    GameContext.instance.sceneRoot.addChild(object);
    return object;
}

function onMouseDown(ev: MouseEvent): any {
    let x: number = ev.x;
    let y: number = ev.y;

    if (GameContext.instance.canvas) {
        x -= GameContext.instance.canvas.offsetLeft;
        y -= GameContext.instance.canvas.offsetTop;
    }

    x = Math.floor(x / GameContext.instance.scale);
    y = Math.floor(y / GameContext.instance.scale);

    const picked = GameContext.instance.sceneRoot.pickGameObject(x, y);

    if (picked) {
        if (picked.onMouseDown) {
            picked.onMouseDown(x - picked.getAbsoluteX(), y - picked.getAbsoluteY());
        }
    }
}

export function run(game: Game, designedWidth: number, designedHeight: number): void {
    GameContext.instance.currentGame = game;

    window.onload = (ev: Event): any => {
        GameContext.instance.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        GameContext.instance.resources = document.getElementById('resources') as HTMLDivElement;

        GameContext.instance.canvas.addEventListener('mousedown', onMouseDown, false);

        GameContext.instance.context2d = GameContext.instance.canvas.getContext('2d');

        GameContext.instance.designedWidth = designedWidth;
        GameContext.instance.designedHeight = designedHeight;

        if (GameContext.instance.currentGame) {
            if (GameContext.instance.currentGame.onLoad) {
                GameContext.instance.currentGame.onLoad();
            }

            if (GameContext.instance.currentGame.onResize) {
                GameContext.instance.currentGame.onResize(window.innerWidth, window.innerHeight);
            }
            recalcScreenSize(GameContext.instance.designedWidth, GameContext.instance.designedHeight);
        }

        gameLoop();
    };

    window.onresize = (ev: UIEvent): any => {
        if (GameContext.instance.currentGame) {
            if (GameContext.instance.currentGame.onResize) {
                GameContext.instance.currentGame.onResize(window.innerWidth, window.innerHeight);
            }
            recalcScreenSize(GameContext.instance.designedWidth, GameContext.instance.designedHeight);
        }
    };
}
