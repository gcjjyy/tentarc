import Game from './Game';
import Font from './Font';
import LocalFileLoader from './LocalFileLoader';

export default class DosFont extends Font {
    private engFont: number[][] = []; // 256x16x8
    private korFont: number[][] = []; // 360x16x16

    private engFontReady = false;
    private korFontReady = false;

    constructor(game: Game, engFilename: string, korFilename: string) {
        super(game);

        this.loadEnglishFont(engFilename);
        this.loadKoreanFont(korFilename);
    }

    public loadEnglishFont(filename: string): void {
        const loader = new LocalFileLoader();
        loader.loadAsBinary(filename, (buffer: ArrayBuffer | null): any => {
            if (buffer) {
                const array = new Uint8Array(buffer);
                for (let i = 0; i < 256; i++) {
                    this.engFont[i] = [];
                    for (let j = 0; j < 16; j++) {
                        this.engFont[i][j] = array[16 * i + j];
                    }
                }
                this.engFontReady = true;
            }
        });
    }

    public loadKoreanFont(filename: string): void {
        const loader = new LocalFileLoader();
        loader.loadAsBinary(filename, (buffer: ArrayBuffer | null): any => {
            if (buffer) {
                const array = new Uint16Array(buffer);
                for (let i = 0; i < 256; i++) {
                    this.korFont[i] = [];
                    for (let j = 0; j < 16; j++) {
                        this.korFont[i][j] = array[16 * i + j];
                    }
                }
                this.korFontReady = true;
            }
        });
    }

    /**
     * Return value: Width of the glyph
     */
    public drawGlyph = (game: Game, context2d: CanvasRenderingContext2D, scale: number, x: number, y: number, glyph: number): number => {
        if (this.engFontReady && glyph < 256) {
            context2d.fillStyle = 'white';
            context2d.fillRect(x, y, 8 * scale, 16 * scale);
            for (let i = 0; i < 16; i++) {
                for (let j = 0; j < 8; j++) {
                    if (this.engFont[glyph][i] & (0x80 >> j)) {
                        context2d.fillStyle = 'black';
                        context2d.fillRect(x + (j * scale), y + (i * scale), scale, scale);
                    }
                }
            }
            return 8;
        } else {
            return 16;
        }
    }
}
