import SceneObject from './SceneObject';
import Scene from './Scene';
import Image from './Image';

export default class Screen {
    public onLoad: (() => void) | null = null;
    public onResize: ((width: number, height: number) => void) | null = null;

    private viewportX: number = 0;
    private viewportY: number = 0;
    private designedWidth: number = 0;
    private designedHeight: number = 0;

    private canvas: HTMLCanvasElement | null = null;
    private canvasId: string = '';
    private context2d: CanvasRenderingContext2D | null = null;
    private scale: number = 1;

    private sceneStack: Scene[] = [];
    private lastTime: number;
    private objectList: SceneObject[] = [];

    constructor(canvasId: string, designedWidth: number, designedHeight: number) {
        this.canvasId = canvasId;

        this.lastTime = Date.now();

        window.addEventListener('load', (ev: Event): any => {
            this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;

            if (this.canvas) {
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

        if (scene.onShow) {
            scene.onShow();
        }

        this.redraw();

        return scene;
    }

    public popScene(): void {
        const currentScene = this.getCurrentScene();
        if (currentScene && currentScene.onHide) {
            currentScene.onHide();
        }

        this.sceneStack.pop();

        this.redraw();
    }

    public getContext2d(): CanvasRenderingContext2D | null {
        return this.context2d;
    }

    public getDesignedWidth(): number {
        return this.designedWidth;
    }

    public getDesignedHeight(): number {
        return this.designedHeight;
    }

    public getScale(): number {
        return this.scale;
    }

    public gameLoop(): void {
        const dt: number = (Date.now() - this.lastTime) / 1000;
        this.lastTime = Date.now();

        requestAnimationFrame(() => { this.gameLoop(); });

        if (this.context2d) {
            this.context2d.clearRect(0, 0, this.context2d.canvas.width, this.context2d.canvas.height);
            this.context2d.save();

            const currentScene = this.getCurrentScene();
            if (currentScene) {
                currentScene.update(dt);

                /**
                 * this.objectList: The list contains objects to draw to screen.
                 */
                this.objectList = [];
                currentScene.traverse(this.objectList);

                // Sort the list by sortIndex
                this.objectList.sort((a: SceneObject, b: SceneObject): number => {
                    if (a.getSortIndex() < b.getSortIndex()) {
                        return -1;
                    } else if (a.getSortIndex() === b.getSortIndex()) {
                        if (a.getAbsoluteY() <= b.getAbsoluteY()) {
                            return -1;
                        } else {
                            return 1;
                        }
                    } else {
                        return 1;
                    }
                });

                for (const object of this.objectList) {
                    if (object.onDraw) {
                        object.onDraw(this);
                    }
                }
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
                this.scale = Math.trunc(this.scale);

                if (this.context2d) {
                    this.context2d.canvas.width = this.designedWidth * this.scale;
                    this.context2d.canvas.height = this.designedHeight * this.scale;
                    this.context2d.imageSmoothingEnabled = false;
                }
            } else {
                if (this.context2d) {
                    this.context2d.canvas.width = this.designedWidth * this.scale;
                    this.context2d.canvas.height = this.designedHeight * this.scale;
                    this.context2d.imageSmoothingEnabled = true;
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

    public setViewportPosition(x: number, y: number): void {
        this.viewportX = x;
        this.viewportY = y;
    }

    public setViewportX(x: number): void {
        this.viewportX = x;
    }

    public setViewportY(y: number): void {
        this.viewportY = y;
    }

    public getViewportX(): number {
        return this.viewportX;
    }

    public getViewportY(): number {
        return this.viewportY;
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

        x = Math.trunc(x / this.scale);
        y = Math.trunc(y / this.scale);

        const currentScene = this.getCurrentScene();
        if (currentScene) {
            const picked = currentScene.pickSceneObject(x, y);

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

    public putPixel(x: number, y: number, color: string) {
        if (this.context2d) {
            this.context2d.fillStyle = color;
            this.context2d.fillRect(
                (x - this.viewportX) * this.scale,
                (y - this.viewportY) * this.scale,
                this.scale, this.scale);
        }
    }

    public drawImage(image: Image, sx: number, sy: number, width: number, height: number, x: number, y: number) {
        if (this.context2d) {
            this.context2d.drawImage(
                image.getImageElement(),
                sx, sy,
                width, height,
                (x - this.viewportX) * this.scale, (y - this.viewportY) * this.scale,
                width * this.scale, height * this.scale);
        }
    }

    private getCurrentScene(): Scene | null {
        if (this.sceneStack.length > 0) {
            return this.sceneStack[this.sceneStack.length - 1];
        }
        return null;
    }
}
