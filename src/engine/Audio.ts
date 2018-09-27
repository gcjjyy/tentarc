import Resource from './Resource';

export default class Audio extends Resource {
    private audio: HTMLAudioElement;

    constructor(filename: string) {
        super();

        this.audio = document.createElement('audio');
        this.audio.src = filename;
        this.audio.style.display = 'none';
        document.body.appendChild(this.audio);
    }

    public play(volume: number = 1): void {
        this.audio.volume = volume;
        this.audio.play();
    }

    public getAudioElement(): HTMLAudioElement {
        return this.audio;
    }
}
