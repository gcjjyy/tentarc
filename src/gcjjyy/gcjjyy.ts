import GameContext from './GameContext';
import Game from './Game';
import GameObject from './GameObject';

function gameLoop(): void {
    requestAnimationFrame(gameLoop);

    if (GameContext.context2d) {
        GameContext.context2d.fillStyle = 'black';
        GameContext.context2d.fill();

        GameContext.context2d.save();

        GameContext.sceneRoot.draw();

        GameContext.context2d.restore();
    }

    if (GameContext.currentGame && GameContext.currentGame.onFrame) {
        GameContext.currentGame.onFrame();
    }
}

function recalcScreenSize(width: number, height: number): void {
    GameContext.scale = Math.min(
        Math.floor(window.innerWidth / width),
        Math.floor(window.innerHeight / height));

    if (GameContext.scale < 1) {
        GameContext.scale = 1;
    }

    if (GameContext.context2d) {
        GameContext.context2d.canvas.width = width * GameContext.scale;
        GameContext.context2d.canvas.height = height * GameContext.scale;
        GameContext.context2d.imageSmoothingEnabled = false;

        // Below is for IE11
        eval('document.getElementById("canvas").getContext("2d").msImageSmoothingEnabled = false;');
    }

    GameContext.sceneRoot.setWidth(width);
    GameContext.sceneRoot.setHeight(height);
}

export function setDesignedScreenSize(designedWidth: number, designedHeight: number): void {
    GameContext.designedWidth = designedWidth;
    GameContext.designedHeight = designedHeight;
    recalcScreenSize(GameContext.designedWidth, GameContext.designedHeight);
}

export function addGameObject(object: GameObject): GameObject {
    object.setParent(GameContext.sceneRoot);
    GameContext.sceneRoot.addChild(object);
    return object;
}

function onMouseDown(ev: MouseEvent): any {
    let x: number = ev.x;
    let y: number = ev.y;

    if (GameContext.canvas) {
        x -= GameContext.canvas.offsetLeft;
        y -= GameContext.canvas.offsetTop;
    }

    x = Math.floor(x / GameContext.scale);
    y = Math.floor(y / GameContext.scale);

    const picked = GameContext.sceneRoot.pickGameObject(x, y);

    if (picked) {
        if (picked.onMouseDown) {
            picked.onMouseDown(x - picked.getAbsoluteX(), y - picked.getAbsoluteY());
        }
    }
}

export function run(game: Game, designedWidth: number, designedHeight: number): void {
    GameContext.currentGame = game;

    window.onload = (ev: Event): any => {
        GameContext.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        GameContext.resources = document.getElementById('resources') as HTMLDivElement;

        GameContext.canvas.addEventListener('mousedown', onMouseDown, false);

        GameContext.context2d = GameContext.canvas.getContext('2d');

        GameContext.designedWidth = designedWidth;
        GameContext.designedHeight = designedHeight;

        if (GameContext.currentGame) {
            if (GameContext.currentGame.onLoad) {
                GameContext.currentGame.onLoad();
            }

            if (GameContext.currentGame.onResize) {
                GameContext.currentGame.onResize(window.innerWidth, window.innerHeight);
            }
            recalcScreenSize(GameContext.designedWidth, GameContext.designedHeight);
        }

        gameLoop();
    };

    window.onresize = (ev: UIEvent): any => {
        if (GameContext.currentGame) {
            if (GameContext.currentGame.onResize) {
                GameContext.currentGame.onResize(window.innerWidth, window.innerHeight);
            }
            recalcScreenSize(GameContext.designedWidth, GameContext.designedHeight);
        }
    };
}
