export default class GameObject {
    public onDraw: (() => void) | null = null;
    public onMouseDown: ((x: number, y: number) => void) | null = null;

    private x: number = 0;
    private y: number = 0;
    private width: number = 0;
    private height: number = 0;
    private parent: GameObject | null = null;
    private childs: GameObject[] = [];

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

        for (const child of this.childs) {
            child.draw();
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
