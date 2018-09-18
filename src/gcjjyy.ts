let g_currentGame: Game;
let g_canvas: HTMLCanvasElement;
let g_resources: HTMLDivElement;
let g_designedWidth: number;
let g_designedHeight: number;
let g_ctx: CanvasRenderingContext2D | null;
let g_scale: number;

export class Resource {

}

export class Image extends Resource {
    private image: HTMLImageElement;

    constructor(filename: string) {
        super();

        this.image = document.createElement('img');
        this.image.src = filename;

        g_resources.appendChild(this.image);
    }

    public getImageElement(): HTMLImageElement {
        return this.image;
    }
}

export class Sound extends Resource {
    protected audio: HTMLAudioElement;

    constructor(filename: string) {
        super();

        this.audio = document.createElement('audio');
        this.audio.src = filename;
        this.audio.autoplay = true;
        this.audio.setAttribute('preload', 'auto');
        this.audio.setAttribute('controls', 'none');

        g_resources.appendChild(this.audio);
    }

    public play(): void {
        this.audio.play();
    }
}

export class GameObject {
    private x: number = 0;
    private y: number = 0;
    private width: number = 0;
    private height: number = 0;
    private parent: GameObject | null = null;
    private childs: Array<GameObject> = new Array<GameObject>();

    constructor(width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
    }

    public setPosition(x: number, y: number): GameObject {
        this.x = x;
        this.y = y;

        return this;
    }

    public setX(x: number): void { this.x = x; }
    public setY(y: number): void { this.y = y; }
    public setWidth(width: number): void { this.width = width; }
    public setHeight(height: number): void { this.height = height; }

    public getX(): number { return this.x; }
    public getY(): number { return this.y; }
    public getWidth(): number { return this.width; }
    public getHeight(): number { return this.height; }

    public getAbsoluteX(): number {
        if (!this.parent) {
            return this.getX();
        }
        else {
            return this.getX() + this.parent.getX();
        }
    }

    public getAbsoluteY(): number {
        if (!this.parent) {
            return this.getY();
        }
        else {
            return this.getY() + this.parent.getY();
        }
    }

    public setParent(object: GameObject): void {
        this.parent = object;
    }

    public addChild(object: GameObject): GameObject {
        this.childs.push(object);
        return object;
    }

    public draw(): void {
        if (this.onDraw) {
            this.onDraw();
        }

        for (let i = 0; i < this.childs.length; i++) {
            this.childs[i].draw();
        }
    }

    public pickGameObject(x: number, y: number): GameObject | null {
        if (x >= this.getAbsoluteX() && y >= this.getAbsoluteY() &&
            x < this.getAbsoluteX() + this.width && y < this.getAbsoluteY() + this.height) {

            for (let i = 0; i < this.childs.length; i++) {
                let result = this.childs[i].pickGameObject(x, y);
                if (result) {
                    return result;
                }
            }

            // There is no child inside the point
            return this;
        }
        else {
            return null;
        }
    }

    public onDraw: (() => void) | null = null;
    public onMouseDown: ((x: number, y:number) => void) | null = null;
}

const g_sceneRoot: GameObject = new GameObject(0, 0);

export class Sprite extends GameObject {
    private image: Image;
    private sx: number;
    private sy: number;

    constructor(image: Image, sx: number, sy: number, width: number, height: number) {
        super(width, height);

        this.sx = sx;
        this.sy = sy;
        this.image = image;
    }

    public onDraw = (): void => {
        if (g_ctx) {
            g_ctx.drawImage(
                this.image.getImageElement(),
                this.sx, this.sy,
                this.getWidth(), this.getHeight(),
                this.getX() * g_scale, this.getY() * g_scale,
                this.getWidth() * g_scale, this.getHeight() * g_scale);
        }
    }
}

export class Game {
    constructor() {
        g_currentGame = this;
    }

    public onLoad = (): void => {};
    public onFrame = (): void => {};
    public onResize = (width: number, height: number): void => {};
}

function gameLoop(): void {
    requestAnimationFrame(gameLoop);

    if (g_ctx) {
        g_ctx.fillStyle = 'black';
        g_ctx.fill();

        g_ctx.save();

        g_sceneRoot.draw();

        g_ctx.restore();
    }

    g_currentGame.onFrame();
}

function recalcScreenSize(width: number, height: number): void {
    g_scale = Math.min(
        Math.floor(window.innerWidth / width),
        Math.floor(window.innerHeight / height));

    if (g_scale < 1) {
        g_scale = 1;
    }

    if (g_ctx) {
        g_ctx.canvas.width = width * g_scale;
        g_ctx.canvas.height = height * g_scale;
        g_ctx.imageSmoothingEnabled = false;
        eval('g_ctx.msImageSmoothingEnabled = false;');
    }

    g_sceneRoot.setWidth(width);
    g_sceneRoot.setHeight(height);
}

export function setDesignedScreenSize(designedWidth: number, designedHeight: number): void {
    g_designedWidth = designedWidth;
    g_designedHeight = designedHeight;
    recalcScreenSize(g_designedWidth, g_designedHeight);
}

export function addGameObject(object: GameObject): GameObject {
    object.setParent(g_sceneRoot);
    g_sceneRoot.addChild(object);
    return object;
}

function onMouseDown(ev: MouseEvent): any {
    let x: number = ev.x;
    let y: number = ev.y;

    x -= g_canvas.offsetLeft;
    y -= g_canvas.offsetTop;

    x = Math.floor(x / g_scale);
    y = Math.floor(y / g_scale);

    let picked = g_sceneRoot.pickGameObject(x, y);

    if (picked) {
        if (picked.onMouseDown) {
            picked.onMouseDown(x - picked.getAbsoluteX(), y - picked.getAbsoluteY());
        }
    }
}

export function run(game: Game, designedWidth: number, designedHeight: number): void {
    g_currentGame = game;

    window.onload = (ev: Event): any => {
        g_canvas = <HTMLCanvasElement>document.getElementById('canvas');
        g_resources = <HTMLDivElement>document.getElementById('resources');

        g_canvas.addEventListener('mousedown', onMouseDown, false);

        g_ctx = g_canvas.getContext('2d');
    
        g_designedWidth = designedWidth;
        g_designedHeight = designedHeight;
    
        g_currentGame.onLoad();

        g_currentGame.onResize(window.innerWidth, window.innerHeight);
        recalcScreenSize(g_designedWidth, g_designedHeight);
    
        gameLoop();
    }

    window.onresize = (ev: UIEvent): any => {
        g_currentGame.onResize(window.innerWidth, window.innerHeight);
        recalcScreenSize(g_designedWidth, g_designedHeight);
    }
}
