import GameContext from './GameContext';
import Resource from './Resource';

export default class Image extends Resource {
    private image: HTMLImageElement;

    constructor(filename: string) {
        super();

        this.image = document.createElement('img');
        this.image.src = filename;

        if (GameContext.resources) {
            GameContext.resources.appendChild(this.image);
        }
    }

    public getImageElement(): HTMLImageElement {
        return this.image;
    }
}
