import Game from './Game';

export default class GameObject {
    public onUpdate: ((dt: number) => void) | null = null;
    public onDraw: ((
        context2d: CanvasRenderingContext2D,
        designedWidth: number,
        designedHeight: number,
        scale: number) => void) | null = null;
    public onMouseDown: ((x: number, y: number) => void) | null = null;
    public onKeyDown: ((key: string, keyCode: number) => void) | null = null;
    public onKeyUp: ((key: string, keyCode: number) => void) | null = null;

    private x: number = 0;
    private y: number = 0;
    private width: number = 0;
    private height: number = 0;
    private sortIndex: number = 1;
    private visible: boolean = true;
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

    public setX(x: number): GameObject {
        this.x = x;
        return this;
    }

    public setY(y: number): GameObject {
        this.y = y;
        return this;
    }

    public setWidth(width: number): GameObject {
        this.width = width;
        return this;
    }

    public setHeight(height: number): GameObject {
        this.height = height;
        return this;
    }


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

    public setSortIndex(sortIndex: number): GameObject {
        this.sortIndex = sortIndex;
        return this;
    }

    public getSortIndex(): number {
        return this.sortIndex;
    }

    public setVisible(visible: boolean): GameObject {
        this.visible = visible;
        return this;
    }

    public setParent(object: GameObject | null): GameObject {
        this.parent = object;
        return this;
    }

    public getParent(): GameObject | null {
        return this.parent;
    }

    public addChild(object: GameObject): GameObject {
        object.setParent(this);
        this.childs.push(object);
        return object;
    }

    public traverse(list: GameObject[]): void {
        if (this.visible) {
            list.push(this);
            for (const child of this.childs) {
                child.traverse(list);
            }
        }
    }

    public update(dt: number): void {
        if (this.onUpdate) {
            this.onUpdate(dt);
        }

        for (const child of this.childs) {
            child.update(dt);
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
