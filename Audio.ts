import Resource from './Resource';

export default class Audio extends Resource {
    private audio: HTMLAudioElement[] = [];
    private channels: number;
    private currentChannel = 0;

    constructor(filename: string, channels: number = 16) {
        super();

        this.channels = channels;

        for (let i = 0; i < channels; i++) {
            this.audio[i] = document.createElement('audio');
            this.audio[i].src = filename;
            this.audio[i].style.display = 'none';
            document.body.appendChild(this.audio[i]);
        }
    }

    public play(volume: number = 1): void {
        this.audio[this.currentChannel].volume = volume;
        this.audio[this.currentChannel].play();
        this.currentChannel++;
        if (this.currentChannel === this.channels) {
            this.currentChannel = 0;
        }
    }
}
