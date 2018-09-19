import GameObject from './GameObject';
import Scene from './Scene';

export default class Game {
    public canvas: HTMLCanvasElement | null = null;
    public canvasId: string = '';
    public resources: HTMLDivElement | null = null;
    public designedWidth: number = 0;
    public designedHeight: number = 0;
    public context2d: CanvasRenderingContext2D | null = null;
    public scale: number = 1;

    public sceneStack: Scene[] = [];

    public onLoad: (() => void) | null = null;
    public onResize: ((width: number, height: number) => void) | null = null;

    constructor(canvasId: string, designedWidth: number, designedHeight: number) {
        this.canvasId = canvasId;

        window.addEventListener('load', (ev: Event): any => {
            this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;

            if (this.canvas) {
                this.resources = document.createElement('div') as HTMLDivElement;
                this.resources.style.display = 'none';
                this.canvas.appendChild(this.resources);
                this.context2d = this.canvas.getContext('2d');

                this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
                    this.onMouseDown(event);
                });
            }

            this.designedWidth = designedWidth;
            this.designedHeight = designedHeight;

            if (this.onLoad) {
                this.onLoad();
            }

            this.refreshScreenSize();
        });

        window.addEventListener('resize', (ev: UIEvent): any => {
            this.refreshScreenSize();
        });

        window.addEventListener('keydown', (ev: KeyboardEvent) => {
            this.onKeyDown(ev);
        });

        window.addEventListener('keyup', (ev: KeyboardEvent) => {
            this.onKeyUp(ev);
        });
    }

    public redraw(): void {
        if (this.context2d) {
            this.context2d.clearRect(0, 0, this.context2d.canvas.width, this.context2d.canvas.height);
        }
    }

    public pushScene(scene: Scene): Scene {
        scene.setParent(null);
        this.sceneStack.push(scene);

        if (scene.onPush) {
            scene.onPush();
        }

        this.redraw();

        return scene;
    }

    public popScene(): void {
        const currentScene = this.getCurrentScene();
        if (currentScene && currentScene.onPop) {
            currentScene.onPop();
        }

        this.sceneStack.pop();

        this.redraw();
    }

    public gameLoop(): void {
        requestAnimationFrame(() => { this.gameLoop(); });

        if (this.context2d) {
            this.context2d.fillStyle = 'black';
            this.context2d.fill();
            this.context2d.save();

            const currentScene = this.getCurrentScene();
            if (currentScene) {
                currentScene.update();
                currentScene.draw(this.context2d, this.scale);
            }
            this.context2d.restore();
        }
    }

    public refreshScreenSize(): void {
        if (this.canvas && this.canvas.parentElement && this.onResize) {
            this.onResize(this.canvas.parentElement.clientWidth, this.canvas.parentElement.clientHeight);
        }
        this.recalcScreenSize();
    }

    public recalcScreenSize(): void {
        if (this.canvas && this.canvas.parentElement) {
            const scaleX: number = this.canvas.parentElement.clientWidth / this.designedWidth;
            const scaleY: number = this.canvas.parentElement.clientHeight / this.designedHeight;

            this.scale = Math.min(scaleX, scaleY);

            if (this.scale >= 1) {
                this.scale = Math.floor(this.scale);

                if (this.context2d) {
                    this.context2d.canvas.width = this.designedWidth * this.scale;
                    this.context2d.canvas.height = this.designedHeight * this.scale;
                    this.context2d.imageSmoothingEnabled = false;

                    // For IE11
                    eval('this.context2d.msImageSmoothingEnabled = false;');
                }
            } else {
                if (this.context2d) {
                    this.context2d.canvas.width = this.designedWidth * this.scale;
                    this.context2d.canvas.height = this.designedHeight * this.scale;
                    this.context2d.imageSmoothingEnabled = true;

                    // For IE11
                    eval('this.context2d.msImageSmoothingEnabled = true;');
                }
            }
        }

        for (const scene of this.sceneStack) {
            scene.setWidth(this.designedWidth);
            scene.setHeight(this.designedHeight);
        }
    }

    public setDesignedScreenSize(designedWidth: number, designedHeight: number): void {
        this.designedWidth = designedWidth;
        this.designedHeight = designedHeight;
        this.recalcScreenSize();
    }

    public onKeyDown(ev: KeyboardEvent): any {
        const currentScene = this.getCurrentScene();
        if (currentScene && currentScene.onKeyDown) {
            currentScene.onKeyDown(ev.key, ev.keyCode);
        }
    }

    public onKeyUp(ev: KeyboardEvent): any {
        const currentScene = this.getCurrentScene();
        if (currentScene && currentScene.onKeyUp) {
            currentScene.onKeyUp(ev.key, ev.keyCode);
        }
    }

    public onMouseDown(ev: MouseEvent): any {
        let x: number = ev.x;
        let y: number = ev.y;

        if (this.canvas) {
            x -= this.canvas.offsetLeft;
            y -= this.canvas.offsetTop;
        }

        x = Math.floor(x / this.scale);
        y = Math.floor(y / this.scale);

        const currentScene = this.getCurrentScene();
        if (currentScene) {
            const picked = currentScene.pickGameObject(x, y);

            if (picked) {
                if (picked.onMouseDown) {
                    picked.onMouseDown(x - picked.getAbsoluteX(), y - picked.getAbsoluteY());
                }
            }
        }
    }

    public run(): void {
        this.gameLoop();
    }

    private getCurrentScene(): Scene | null {
        if (this.sceneStack.length > 0) {
            return this.sceneStack[this.sceneStack.length - 1];
        }
        return null;
    }
}
