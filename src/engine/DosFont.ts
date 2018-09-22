import Game from './Game';
import Font from './Font';

export default class DosFont extends Font {
    constructor(game: Game, engFilename: string, korFilename: string) {
        super(game);

        this.loadEnglishFont(engFilename);
        this.loadKoreanFont(korFilename);
    }

    public loadKoreanFont(filename: string): void {

    }

    public loadEnglishFont(filename: string): void {

    }
}
