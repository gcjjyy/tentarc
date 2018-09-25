import Resource from './Resource';
import LocalFileLoader from './LocalFileLoader';

export default class Sound extends Resource {
    private context: AudioContext;
    private source: AudioBufferSourceNode | null = null;
    private gain: GainNode | null = null;
    private buffer: AudioBuffer | null = null;
    private loadComplete: boolean = false;
    private volume: number = 1;
    private onload: (() => void) | null = null;

    constructor() {
        super();
        this.context = new AudioContext();
    }

    public load(filename: string, onload: (() => void) | null = null): void {
        if (this.context) {
            this.onload = onload;
            const loader = new LocalFileLoader();
            loader.loadAsBinary(filename, (buffer: ArrayBuffer | null): any => {
                if (this.context && buffer) {
                    this.context.decodeAudioData(buffer, this.decodeCallback);
                }
            });
        }
    }

    public play(): void {
        if (this.loadComplete) {
            this.source = this.context.createBufferSource();
            this.gain = this.context.createGain();
            this.gain.gain.value = this.volume;

            this.source.buffer = this.buffer;
            this.source.connect(this.gain);
            this.gain.connect(this.context.destination);
            this.source.start();
        }
    }

    public setVolume(volume: number): void {
        this.volume = volume;

        if (this.gain) {
            this.gain.gain.value = volume;
        }
    }

    public stop(): void {
        if (this.source) {
            this.source.stop();
        }
    }

    private decodeCallback = (buffer: AudioBuffer): void => {
        this.buffer = buffer;
        this.loadComplete = true;

        if (this.onload) {
            this.onload();
        }
    }
}
