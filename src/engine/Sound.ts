import Resource from './Resource';
import LocalFileLoader from './LocalFileLoader';

export default class Sound extends Resource {
    private context: AudioContext | null = null;

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

    private decodeCallback = (buffer: AudioBuffer): void => {
        if (this.context) {
            const source = this.context.createBufferSource();
            source.buffer = buffer;
            source.connect(this.context.destination);
            source.start();
        }
    }
}
