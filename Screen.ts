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
    private context2d: CanvasRenderingContext2D | null = null;
    private scale: number = 1;
    private fillStyle: string = 'unknown';

    private sceneStack: Scene[] = [];
    private lastTime: number;
    private second: number = 1;
    private frames: number = 0;
    private objectList: SceneObject[] = [];

    constructor(canvasId: string, designedWidth: number, designedHeight: number) {
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
        this.context2d!.clearRect(0, 0, this.context2d!.canvas.width, this.context2d!.canvas.height);
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

        this.second -= dt;
        if (this.second <= 0) {
            if (process.env.NODE_ENV !== 'production') {
                console!.log('fps:', this.frames);
            }
            this.second += 1;
            this.frames = 0;
        }

        this.context2d!.clearRect(0, 0, this.context2d!.canvas.width, this.context2d!.canvas.height);

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
                if (a.getGlobalSortIndex() < b.getGlobalSortIndex()) {
                    return -1;
                } else if (a.getGlobalSortIndex() === b.getGlobalSortIndex()) {
                    if (a.getGlobalY() <= b.getGlobalY()) {
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

        this.frames++;

        requestAnimationFrame(() => { this.gameLoop(); });
    }

    public refreshScreenSize(): void {
        if (this.onResize) {
            this.onResize(this.canvas!.parentElement!.clientWidth, this.canvas!.parentElement!.clientHeight);
        }
        this.recalcScreenSize();
    }

    public recalcScreenSize(): void {
        const scaleX: number = this.canvas!.parentElement!.clientWidth / this.designedWidth;
        const scaleY: number = this.canvas!.parentElement!.clientHeight / this.designedHeight;

        this.scale = Math.min(scaleX, scaleY);

        if (this.scale >= 1) {
            this.scale = Math.floor(this.scale);

            this.context2d!.canvas.width = this.designedWidth * this.scale;
            this.context2d!.canvas.height = this.designedHeight * this.scale;
            this.context2d!.imageSmoothingEnabled = false;
        } else {
            this.context2d!.canvas.width = this.designedWidth * this.scale;
            this.context2d!.canvas.height = this.designedHeight * this.scale;
            this.context2d!.imageSmoothingEnabled = true;
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

        x = Math.floor(x / this.scale);
        y = Math.floor(y / this.scale);

        const currentScene = this.getCurrentScene();
        if (currentScene) {
            const picked = currentScene.pickSceneObject(x, y);

            if (picked) {
                if (picked.onMouseDown) {
                    picked.onMouseDown(x - picked.getGlobalX(), y - picked.getGlobalY());
                }
            }
        }
    }

    public run(): void {
        this.gameLoop();
    }

    public setFillStyle(style: string): void {
        this.fillStyle = style;
        this.context2d!.fillStyle = style;
    }

    public getFillStyle(): string {
        return this.fillStyle;
    }

    public setGlobalCompositeOperation(op: string, color: string): void {
        this.context2d!.globalCompositeOperation = op;
        this.context2d!.fillStyle = color;
    }

    public putPixel(sender: SceneObject, localX: number, localY: number) {
        const absx = sender.getGlobalX() + (localX * sender.getScale());
        const absy = sender.getGlobalY() + (localY * sender.getScale());
        const absscale = sender.getGlobalScale();

        this.context2d!.fillRect(
            ((sender.getPinned()) ? absx : (absx - this.viewportX)) * this.scale,
            ((sender.getPinned()) ? absy : (absy - this.viewportY)) * this.scale,
            absscale * this.scale, absscale * this.scale);
    }

    public drawRect(
        sender: SceneObject,
        localX: number,
        localY: number,
        width: number,
        height: number): void {

        const absx = sender.getGlobalX() + (localX * sender.getScale());
        const absy = sender.getGlobalY() + (localY * sender.getScale());
        const absscale = sender.getGlobalScale();

        this.context2d!.fillRect(
            ((sender.getPinned()) ? absx : (absx - this.viewportX)) * this.scale,
            ((sender.getPinned()) ? absy : (absy - this.viewportY)) * this.scale,
            width * absscale * this.scale,
            height * absscale * this.scale);
    }

    public drawImage(
        sender: SceneObject,
        image: Image,
        sx: number,
        sy: number,
        width: number,
        height: number,
        localX: number,
        localY: number): void {

        const absx = sender.getGlobalX() + (localX * sender.getScale());
        const absy = sender.getGlobalY() + (localY * sender.getScale());
        const absscale = sender.getGlobalScale();

        this.context2d!.drawImage(
            image.getImageElement(),
            sx, sy,
            width, height,
            ((sender.getPinned()) ? absx : (absx - this.viewportX)) * this.scale,
            ((sender.getPinned()) ? absy : (absy - this.viewportY)) * this.scale,
            width * absscale * this.scale,
            height * absscale * this.scale);
    }

    private getCurrentScene(): Scene | null {
        if (this.sceneStack.length > 0) {
            return this.sceneStack[this.sceneStack.length - 1];
        }
        return null;
    }
}
