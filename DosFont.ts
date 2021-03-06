import Font from './Font';
import Screen from './Screen';
import LocalFileLoader from './LocalFileLoader';
import SceneObject from './SceneObject';

/**
 * Important!!
 * -----------
 * DosFont is drawing so many fillRects, so performance is very bad.
 * Please consider it.
 */
export default class DosFont extends Font {
    private static choType: number[] = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 2, 4, 4, 4, 2, 1, 3, 0,
    ];
    private static choTypeJongExist: number[] = [
        0, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 7, 7, 6, 6, 7, 7, 7, 6, 6, 7, 5,
    ];
    private static jongType: number[] = [
        0, 0, 2, 0, 2, 1, 2, 1, 2, 3, 0, 2, 1, 3, 3, 1, 2, 1, 3, 3, 1, 1,
    ];
    private static jamoTable: number[] = [
        0, 1, 2, 0, 3, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0,
        0, 7, 8, 9, 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
        172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182,
    ];

    private static indexJoongStart = 160;
    private static indexJongStart = 160 + 88;

    private engFont: number[][] = []; // 256x16x8 (number as uint8)
    private korFont: number[][] = []; // 360x16x16 (number as uint16)

    private engFontReady = false;
    private korFontReady = false;

    constructor(engFilename: string, korFilename: string) {
        super();

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

    public getWidth = (ch: string): number => {
        if (ch.charCodeAt(0) < 256) {
            return 8;
        } else {
            return 16;
        }
    }

    public getHeight = (): number => {
        return 16;
    }

    /**
     * Return value: {x, y} of the glyph
     */
    public drawGlyph = (
        sender: SceneObject,
        screen: Screen,
        x: number,
        y: number,
        fontColor: string,
        ch: string): void => {

        let code = ch.charCodeAt(0);
        screen.setFillStyle(fontColor);

        if (this.engFontReady && code < 256) {
            this.drawEngGlyph(sender, screen, x, y, code);
        } else if (this.korFontReady) {

            if (code >= 0x3130 && code <= 0x318f) {
                code = code - 0x3130;
                this.drawKorGlyph(sender, screen, x, y, DosFont.jamoTable[code]);
            } else if (code >= 0xac00 && code <= 0xd7af) {
                code = code - 0xac00;

                const cho = Math.floor(Math.floor(code / 28) / 21) + 1;
                const joong = (Math.floor(code / 28) % 21) + 1;
                const jong = code % 28;

                const choType = (jong) ? DosFont.choTypeJongExist[joong] : DosFont.choType[joong];
                const joongType = ((cho === 1 || cho === 16) ? 0 : 1) + (jong ? 2 : 0);
                const jongType = DosFont.jongType[joong];

                this.drawKorGlyph(sender, screen, x, y, choType * 20 + cho);
                this.drawKorGlyph(sender, screen, x, y, DosFont.indexJoongStart + (joongType * 22 + joong));

                if (jong) {
                    this.drawKorGlyph(sender, screen, x, y, DosFont.indexJongStart + (jongType * 28 + jong));
                }
            }
        }
    }

    private drawEngGlyph(
        sender: SceneObject,
        screen: Screen,
        x: number,
        y: number,
        code: number): void {

        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.engFont[code][i] & (0x80 >> j)) {
                    screen.putPixel(sender, x + j, y + i);
                }
            }
        }
    }

    private drawKorGlyph(
        sender: SceneObject,
        screen: Screen,
        x: number,
        y: number,
        code: number): void {

        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.korFont[code][i] & (0x0080 >> j)) {
                    screen.putPixel(sender, x + j, y + i);
                }
            }
            for (let j = 0; j < 8; j++) {
                if (this.korFont[code][i] & (0x8000 >> j)) {
                    screen.putPixel(sender, x + (j + 8), y + i);
                }
            }
        }
    }
}
