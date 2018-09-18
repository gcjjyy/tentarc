import GameObject from '@/gcjjyy/GameObject';

export default class Game {
    public static currentGame: Game | null = null;
    public static canvas: HTMLCanvasElement | null = null;
    public static resources: HTMLDivElement | null = null;
    public static designedWidth: number = 0;
    public static designedHeight: number = 0;
    public static context2d: CanvasRenderingContext2D | null = null;
    public static scale: number = 1;
    public static sceneRoot: GameObject = new GameObject(0, 0);

    public static gameLoop(): void {
        requestAnimationFrame(Game.gameLoop);

        if (Game.context2d) {
            Game.context2d.fillStyle = 'black';
            Game.context2d.fill();
            Game.context2d.save();
            Game.sceneRoot.draw();
            Game.context2d.restore();
        }

        if (Game.currentGame && Game.currentGame.onFrame) {
            Game.currentGame.onFrame();
        }
    }

    public static recalcScreenSize(width: number, height: number): void {
        Game.scale = Math.min(
            Math.floor(window.innerWidth / width),
            Math.floor(window.innerHeight / height));

        if (Game.scale < 1) {
            Game.scale = 1;
        }

        if (Game.context2d) {
            Game.context2d.canvas.width = width * Game.scale;
            Game.context2d.canvas.height = height * Game.scale;
            Game.context2d.imageSmoothingEnabled = false;

            // Below is for IE11
            eval('document.getElementById("canvas").getContext("2d").msImageSmoothingEnabled = false;');
        }

        Game.sceneRoot.setWidth(width);
        Game.sceneRoot.setHeight(height);
    }

    public static setDesignedScreenSize(designedWidth: number, designedHeight: number): void {
        Game.designedWidth = designedWidth;
        Game.designedHeight = designedHeight;
        Game.recalcScreenSize(Game.designedWidth, Game.designedHeight);
    }

    public static addGameObject(object: GameObject): GameObject {
        object.setParent(Game.sceneRoot);
        Game.sceneRoot.addChild(object);
        return object;
    }

    public static onMouseDown(ev: MouseEvent): any {
        let x: number = ev.x;
        let y: number = ev.y;

        if (Game.canvas) {
            x -= Game.canvas.offsetLeft;
            y -= Game.canvas.offsetTop;
        }

        x = Math.floor(x / Game.scale);
        y = Math.floor(y / Game.scale);

        const picked = Game.sceneRoot.pickGameObject(x, y);

        if (picked) {
            if (picked.onMouseDown) {
                picked.onMouseDown(x - picked.getAbsoluteX(), y - picked.getAbsoluteY());
            }
        }
    }

    public onLoad: (() => void) | null = null;
    public onFrame: (() => void) | null = null;
    public onResize: ((width: number, height: number) => void) | null = null;

    constructor(designedWidth: number, designedHeight: number) {
        Game.currentGame = this;
        Game.sceneRoot = new GameObject(0, 0);

        window.onload = (ev: Event): any => {
            Game.canvas = document.getElementById('canvas') as HTMLCanvasElement;
            Game.resources = document.getElementById('resources') as HTMLDivElement;

            Game.canvas.addEventListener('mousedown', Game.onMouseDown, false);

            Game.context2d = Game.canvas.getContext('2d');

            Game.designedWidth = designedWidth;
            Game.designedHeight = designedHeight;

            if (this.onLoad) {
                this.onLoad();
            }

            if (this.onResize) {
                this.onResize(window.innerWidth, window.innerHeight);
            }
            Game.recalcScreenSize(Game.designedWidth, Game.designedHeight);
        };

        window.onresize = (ev: UIEvent): any => {
            if (Game.currentGame) {
                if (Game.currentGame.onResize) {
                    Game.currentGame.onResize(window.innerWidth, window.innerHeight);
                }
                Game.recalcScreenSize(Game.designedWidth, Game.designedHeight);
            }
        };
    }

    public run(): void {
        Game.gameLoop();
    }
}
