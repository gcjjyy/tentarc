import GameContext from './GameContext';
import Resource from './Resource';

export default class Sound extends Resource {
    protected audio: HTMLAudioElement;

    constructor(filename: string) {
        super();

        this.audio = document.createElement('audio');
        this.audio.src = filename;
        this.audio.autoplay = true;
        this.audio.setAttribute('preload', 'auto');
        this.audio.setAttribute('controls', 'none');

        if (GameContext.resources) {
            GameContext.resources.appendChild(this.audio);
        }
    }

    public play(): void {
        this.audio.play();
    }
}
