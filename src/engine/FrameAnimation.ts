import Frame from './Frame';

export default class FrameAnimation {
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

    public onUpdate(dt: number): void {
        this.remainTime -= dt;
        if (this.remainTime <= 0) {
            this.remainTime += (this.duration / this.frames.length);
            this.currentFrame++;
            if (this.currentFrame >= this.frames.length) {
                this.currentFrame = 0;
            }
        }
    }
}
