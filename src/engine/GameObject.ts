import Game from './Game';

export default class GameObject {
    public onUpdate: (() => void) | null = null;
    public onDraw: ((context2d: CanvasRenderingContext2D, scale: number) => void) | null = null;
    public onMouseDown: ((x: number, y: number) => void) | null = null;
    public onKeyDown: ((key: string, keyCode: number) => void) | null = null;
    public onKeyUp: ((key: string, keyCode: number) => void) | null = null;

    private x: number = 0;
    private y: number = 0;
    private width: number = 0;
    private height: number = 0;
    private parent: GameObject | null = null;
    private childs: GameObject[] = [];

    constructor(width: number, height: number) {
        this.setWidth(width);
        this.setHeight(height);
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
        } else {
            return this.getX() + this.parent.getX();
        }
    }

    public getAbsoluteY(): number {
        if (!this.parent) {
            return this.getY();
        } else {
            return this.getY() + this.parent.getY();
        }
    }

    public setParent(object: GameObject | null): void {
        this.parent = object;
    }

    public addChild(object: GameObject): GameObject {
        object.setParent(this);
        this.childs.push(object);
        return object;
    }

    public update(): void {
        if (this.onUpdate) {
            this.onUpdate();
        }

        for (const child of this.childs) {
            child.update();
        }
    }

    public draw(context2d: CanvasRenderingContext2D, scale: number): void {
        if (this.onDraw) {
            this.onDraw(context2d, scale);
        }

        for (const child of this.childs) {
            child.draw(context2d, scale);
        }
    }

    public pickGameObject(x: number, y: number): GameObject | null {
        if (x >= this.getAbsoluteX() && y >= this.getAbsoluteY() &&
            x < this.getAbsoluteX() + this.width && y < this.getAbsoluteY() + this.height) {

            for (const child of this.childs) {
                const result = child.pickGameObject(x, y);
                if (result) {
                    return result;
                }
            }

            // There is no child inside the point
            return this;
        } else {
            return null;
        }
    }
}
