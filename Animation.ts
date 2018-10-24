import Frame from './Frame';

export default class Animation {
    private id: string;
    private duration: number;
    private frames: Frame[] = [];
    private currentFrame: number = 0;
    private remainTime: number = 0;

    constructor(id: string, duration: number) {
        this.id = id;
        this.duration = duration;
    }

    public addFrame(frame: Frame): void {
        this.frames.push(frame);
        this.remainTime = this.duration / this.frames.length;
    }

    public getCurrentFrame(): Frame {
        return this.frames[this.currentFrame];
    }

    public onUpdate(dt: number): boolean {
        this.remainTime -= dt;
        while (this.remainTime <= 0) {
            this.remainTime += (this.duration / this.frames.length);
            this.currentFrame++;
            if (this.currentFrame >= this.frames.length) {
                this.currentFrame = 0;
            }

            return true;
        }

        return false;
    }
}
