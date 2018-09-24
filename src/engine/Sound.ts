import Resource from './Resource';
import LocalFileLoader from './LocalFileLoader';

export default class Sound extends Resource {
    private context: AudioContext | null = null;
    private source: AudioBufferSourceNode | null = null;

    constructor() {
        super();

        try {
            this.context = new AudioContext();
        } catch (e) {
            this.context = null;
        }
    }

    public play(filename: string): void {
        if (this.context) {
            const loader = new LocalFileLoader();
            loader.loadAsBinary(filename, (buffer: ArrayBuffer | null): any => {
                if (this.context && buffer) {
                    this.context.decodeAudioData(buffer, this.decodeCallback);
                }
            });
        }
    }

    public stop(): void {
        if (this.source) {
            this.source.stop();
        }
    }

    private decodeCallback = (buffer: AudioBuffer): void => {
        if (this.context) {
            this.source = this.context.createBufferSource();
            this.source.buffer = buffer;
            this.source.connect(this.context.destination);
            this.source.start();
        }
    }
}
