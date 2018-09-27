import Screen from './Screen';

export default class SceneObject {
    public onUpdate: ((dt: number) => void) | null = null;
    public onDraw: ((screen: Screen) => void) | null = null;
    public onMouseDown: ((x: number, y: number) => void) | null = null;
    public onKeyDown: ((key: string, keyCode: number) => void) | null = null;
    public onKeyUp: ((key: string, keyCode: number) => void) | null = null;

    private x: number = 0;
    private y: number = 0;
    private width: number = 0;
    private height: number = 0;
    private scale: number = 1;
    private sortIndex: number = 1;
    private visible: boolean = true;
    private parent: SceneObject | null = null;
    private childs: SceneObject[] = [];
    private pinned: boolean = false;

    constructor(width: number, height: number) {
        this.setWidth(width);
        this.setHeight(height);
    }

    public setPosition(x: number, y: number): SceneObject {
        this.x = x;
        this.y = y;

        return this;
    }

    public setX(x: number): SceneObject {
        this.x = x;
        return this;
    }

    public setY(y: number): SceneObject {
        this.y = y;
        return this;
    }

    public setPinned(pinned: boolean): SceneObject {
        this.pinned = pinned;
        return this;
    }

    public getPinned(): boolean {
        if (!this.parent) {
            return this.pinned;
        } else {
            return this.pinned || this.parent.getPinned();
        }
    }

    public setSize(width: number, height: number): SceneObject {
        this.width = width;
        this.height = height;
        return this;
    }

    public setWidth(width: number): SceneObject {
        this.width = width;
        return this;
    }

    public setHeight(height: number): SceneObject {
        this.height = height;
        return this;
    }


    public getX(): number { return this.x; }
    public getY(): number { return this.y; }
    public getWidth(): number { return this.width; }
    public getHeight(): number { return this.height; }

    public getGlobalX(): number {
        if (!this.parent) {
            return (this.x * this.scale);
        } else {
            return (this.x * this.scale) + this.parent.getGlobalX();
        }
    }

    public getGlobalY(): number {
        if (!this.parent) {
            return (this.y * this.scale);
        } else {
            return (this.y * this.scale) + this.parent.getGlobalY();
        }
    }

    public setScale(scale: number): SceneObject {
        this.scale = scale;
        return this;
    }

    public getScale(): number {
        return this.scale;
    }

    public getGlobalScale(): number {
        if (!this.parent) {
            return this.scale;
        } else {
            return this.scale * this.parent.getGlobalScale();
        }
    }

    public setSortIndex(sortIndex: number): SceneObject {
        this.sortIndex = sortIndex;
        return this;
    }

    public getSortIndex(): number {
        return this.sortIndex;
    }

    public setVisible(visible: boolean): SceneObject {
        this.visible = visible;
        return this;
    }

    public getVisible(): boolean {
        return this.visible;
    }

    public setParent(object: SceneObject | null): SceneObject {
        this.parent = object;
        return this;
    }

    public getParent(): SceneObject | null {
        return this.parent;
    }

    public addChild(object: SceneObject): SceneObject {
        object.setParent(this);
        this.childs.push(object);
        return object;
    }

    public traverse(list: SceneObject[]): void {
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

    public pickSceneObject(x: number, y: number): SceneObject | null {
        if (x >= this.getGlobalX() && y >= this.getGlobalY() &&
            x < this.getGlobalX() + this.width && y < this.getGlobalY() + this.height) {

            for (const child of this.childs) {
                const result = child.pickSceneObject(x, y);
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
