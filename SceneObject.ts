import Screen from './Screen';

export default class SceneObject {
    public onUpdate: ((dt: number) => boolean) | null = null;
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
    public needRedraw = true;

    constructor(width: number, height: number) {
        this.setWidth(width);
        this.setHeight(height);
    }

    public setPosition(x: number, y: number): SceneObject {
        if (this.x !== x || this.y !== y) {
            this.redraw();
        }

        this.x = x;
        this.y = y;

        return this;
    }

    public setX(x: number): SceneObject {
        if (this.x !== x) {
            this.redraw();
        }

        this.x = x;
        return this;
    }

    public setY(y: number): SceneObject {
        if (this.y !== y) {
            this.redraw();
        }

        this.y = y;
        return this;
    }

    public setPinned(pinned: boolean): SceneObject {
        if (this.pinned !== pinned) {
            this.redraw();
        }

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
        if (this.width !== width || this.height !== height) {
            this.redraw();
        }

        this.width = width;
        this.height = height;
        return this;
    }

    public setWidth(width: number): SceneObject {
        if (this.width !== width) {
            this.redraw();
        }

        this.width = width;
        return this;
    }

    public setHeight(height: number): SceneObject {
        if (this.height !== height) {
            this.redraw();
        }

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
        if (this.scale !== scale) {
            this.redraw();
        }

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
        if (this.sortIndex !== sortIndex) {
            this.redraw();
        }

        this.sortIndex = sortIndex;
        return this;
    }

    public getSortIndex(): number {
        return this.sortIndex;
    }

    public getGlobalSortIndex(): number {
        if (!this.parent) {
            return this.sortIndex;
        } else {
            return this.sortIndex + this.parent.getGlobalSortIndex();
        }
    }

    public setVisible(visible: boolean): SceneObject {
        if (this.visible !== visible) {
            this.redraw();
        }

        this.visible = visible;
        return this;
    }

    public getVisible(): boolean {
        return this.visible;
    }

    public setParent(object: SceneObject | null): SceneObject {
        if (this.parent !== object) {
            this.redraw();
        }

        this.parent = object;
        return this;
    }

    public getParent(): SceneObject | null {
        return this.parent;
    }

    public addChild(object: SceneObject): SceneObject {
        this.redraw();

        object.setParent(this);
        this.childs.push(object);
        return object;
    }

    public traverse(list: SceneObject[]) {
        if (this.visible) {
            list.push(this);
            for (const child of this.childs) {
                child.traverse(list);
            }
        }
    }

    public redraw() {
        this.needRedraw = true;
    }

    public update(dt: number): boolean {
        let result = this.needRedraw;

        if (this.onUpdate) {
            if (this.onUpdate(dt)) {
                result = true;
            }
        }

        for (const child of this.childs) {
            if (child.update(dt)) {
                result = true;
            }
        }

        this.needRedraw = false;
        return result;
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
