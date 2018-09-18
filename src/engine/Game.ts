import GameObject from './GameObject';

export default class Game {
    public canvas: HTMLCanvasElement | null = null;
    public canvasId: string = '';
    public resources: HTMLDivElement | null = null;
    public designedWidth: number = 0;
    public designedHeight: number = 0;
    public context2d: CanvasRenderingContext2D | null = null;
    public scale: number = 1;
    public sceneRoot: GameObject = new GameObject(this, 0, 0);

    public onLoad: (() => void) | null = null;
    public onFrame: (() => void) | null = null;
    public onResize: ((width: number, height: number) => void) | null = null;

    constructor(canvasId: string, designedWidth: number, designedHeight: number) {
        this.canvasId = canvasId;

        window.addEventListener('load', (ev: Event): any => {
            this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;

            if (this.canvas) {
                this.resources = document.createElement('div') as HTMLDivElement;
                this.resources.style.display = 'none';
                this.canvas.appendChild(this.resources);

                this.canvas.addEventListener(
                    'mousedown',
                    (event: MouseEvent) => { this.onMouseDown(event); },
                    false);

                this.context2d = this.canvas.getContext('2d');
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
    }

    public gameLoop(): void {
        requestAnimationFrame(() => { this.gameLoop(); });

        if (this.context2d) {
            this.context2d.fillStyle = 'black';
            this.context2d.fill();
            this.context2d.save();
            this.sceneRoot.draw();
            this.context2d.restore();
        }

        if (this.onFrame) {
            this.onFrame();
        }
    }

    public refreshScreenSize(): void {
        if (this.canvas && this.canvas.parentElement && this.onResize) {
            this.onResize(this.canvas.parentElement.clientWidth, this.canvas.parentElement.clientHeight);
        }
        this.recalcScreenSize(this.designedWidth, this.designedHeight);
    }

    public recalcScreenSize(width: number, height: number): void {
        if (this.canvas && this.canvas.parentElement) {
            this.scale = Math.min(
                Math.floor(this.canvas.parentElement.clientWidth / width),
                Math.floor(this.canvas.parentElement.clientHeight / height));

            if (this.scale < 1) {
                this.scale = 1;
            }

            if (this.context2d) {
                this.context2d.canvas.width = width * this.scale;
                this.context2d.canvas.height = height * this.scale;
                this.context2d.imageSmoothingEnabled = false;

                // For IE11
                eval('this.context2d.msImageSmoothingEnabled = false;');
            }
        }

        this.sceneRoot.setWidth(width);
        this.sceneRoot.setHeight(height);
    }

    public setDesignedScreenSize(designedWidth: number, designedHeight: number): void {
        this.designedWidth = designedWidth;
        this.designedHeight = designedHeight;
        this.recalcScreenSize(this.designedWidth, this.designedHeight);
    }

    public addGameObject(object: GameObject): GameObject {
        object.setParent(this.sceneRoot);
        this.sceneRoot.addChild(object);
        return object;
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

        const picked = this.sceneRoot.pickGameObject(x, y);

        if (picked) {
            if (picked.onMouseDown) {
                picked.onMouseDown(x - picked.getAbsoluteX(), y - picked.getAbsoluteY());
            }
        }
    }

    public run(): void {
        this.gameLoop();
    }
}
