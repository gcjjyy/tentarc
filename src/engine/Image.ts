import Resource from './Resource';

export default class Image extends Resource {
    private image: HTMLImageElement;

    constructor(filename: string) {
        super();

        this.image = document.createElement('img');
        this.image.src = filename;
        this.image.style.display = 'none';
        document.body.appendChild(this.image);
    }

    public getImageElement(): HTMLImageElement {
        return this.image;
    }

    public getWidth(): number {
        return this.image.naturalWidth;
    }

    public getHeight(): number {
        return this.image.naturalHeight;
    }
}
