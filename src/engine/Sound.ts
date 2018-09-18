import Game from './Game';
import Resource from './Resource';

export default class Sound extends Resource {
    protected audio: HTMLAudioElement;

    constructor(game: Game, filename: string) {
        super();

        this.audio = document.createElement('audio');
        this.audio.src = filename;
        this.audio.autoplay = false;
        this.audio.setAttribute('preload', 'auto');
        this.audio.setAttribute('controls', 'none');

        if (game.resources) {
            game.resources.appendChild(this.audio);
        }
    }

    public play(): void {
        this.audio.play();
    }
}
