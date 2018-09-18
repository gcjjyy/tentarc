import Game from './Game';
import Resource from './Resource';

export default class Image extends Resource {
    private image: HTMLImageElement;

    constructor(game: Game, filename: string) {
        super();

        this.image = document.createElement('img');
        this.image.src = filename;

        if (game.resources) {
            game.resources.appendChild(this.image);
        }
    }

    public getImageElement(): HTMLImageElement {
        return this.image;
    }
}
