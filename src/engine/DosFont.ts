import Game from './Game';
import Font from './Font';
import LocalFileLoader from './LocalFileLoader';

export default class DosFont extends Font {
    private engFont: number[][] = []; // 256x16x8 (number as uint8)
    private korFont: number[][] = []; // 360x16x16 (number as uint16)

    private engFontReady = false;
    private korFontReady = false;

    private static choType: number[] = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 2, 4, 4, 4, 2, 1, 3, 0
    ];
    private static choTypeJongExist: number[] = [
        0, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 7, 7, 6, 6, 7, 7, 7, 6, 6, 7, 5
    ];
    private static jongType: number[] = [
        0, 0, 2, 0, 2, 1, 2, 1, 2, 3, 0, 2, 1, 3, 3, 1, 2, 1, 3, 3, 1, 1
    ];
    private static jamoTable: number[] = [
        1, 2, 0, 3, 0, 0,  4,  5,  6,  0,  0,  0,  0,  0,  0,
        0, 7, 8, 9, 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
    ];

    private static indexJoongStart = 160;
    private static indexJongStart = 160 + 88;

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
                for (let i = 0; i < 360; i++) {
                    this.korFont[i] = [];
                    for (let j = 0; j < 16; j++) {
                        this.korFont[i][j] = array[16 * i + j];
                    }
                }
                this.korFontReady = true;
            }
        });
    }

    private drawEngGlyph(game: Game, context2d: CanvasRenderingContext2D, scale: number, x: number, y: number, glyph: number): void {
        context2d.fillStyle = 'white';

        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.engFont[glyph][i] & (0x80 >> j)) {
                    context2d.fillRect(x + (j * scale), y + (i * scale), scale, scale);
                }
            }
        }
    }

    private drawKorGlyph(game: Game, context2d: CanvasRenderingContext2D, scale: number, x: number, y: number, glyph: number): void {
        context2d.fillStyle = 'white';

        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.korFont[glyph][i] & (0x0080 >> j)) {
                    context2d.fillRect(x + (j * scale), y + (i * scale), scale, scale);
                }
            }
            for (let j = 0; j < 8; j++) {
                if (this.korFont[glyph][i] & (0x8000 >> j)) {
                    context2d.fillRect(x + ((j + 8) * scale), y + (i * scale), scale, scale);
                }
            }
        }
    }

    /**
     * Return value: Width of the glyph
     */
    public drawGlyph = (game: Game, context2d: CanvasRenderingContext2D, scale: number, x: number, y: number, glyph: number): number => {
        if (this.engFontReady && glyph < 256) {
            this.drawEngGlyph(game, context2d, scale, x, y, glyph);
            return 8;
        } else if (this.korFontReady) {
            const code = glyph - 0xac00;

            const cho = Math.trunc(Math.trunc(code / 28) / 21) + 1;
            const joong = (Math.trunc(code / 28) % 21) + 1;
            const jong = code % 28;

            const cho_type = (jong) ? DosFont.choTypeJongExist[joong] : DosFont.choType[joong];
            const joong_type = ((cho == 1 || cho == 16) ? 0 : 1) + (jong ? 2 : 0);
            const jong_type = DosFont.jongType[joong];

            this.drawKorGlyph(game, context2d, scale, x, y, cho_type * 20 + cho);
            this.drawKorGlyph(game, context2d, scale, x, y, DosFont.indexJoongStart + (joong_type * 22 + joong));

            if (jong) {
                this.drawKorGlyph(game, context2d, scale, x, y, DosFont.indexJongStart + (jong_type * 28 + jong));
            }

            return 16;
        }
        return 0;
    }
}
