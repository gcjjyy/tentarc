import Game from './Game';
import Image from './Image';
import Sprite from './Sprite';
import Frame from './Frame';
import Animation from './Animation';
import LocalFileLoader from './LocalFileLoader';

interface SpriteJsonFrame {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface SpriteJsonAnimation {
    id: string;
    duration: number;
    frames: SpriteJsonFrame[];
}

interface SpriteJson {
    image: string;
    animations: SpriteJsonAnimation[];
}

export default class SpriteJsonLoader {
    public static load(game: Game, filename: string, onload: (sprite: Sprite | null) => any): void {
        const loader = new LocalFileLoader();
        loader.loadAsText(filename, (data: string | null): any => {
            if (data) {
                const spritedata: SpriteJson = JSON.parse(data);
                const image = new Image(game, spritedata.image);
                const sprite = new Sprite(image);

                for (const animation of spritedata.animations) {
                    const anim = new Animation(animation.id, animation.duration);
                    for (const frame of animation.frames) {
                        anim.addFrame(new Frame(frame.x, frame.y, frame.width, frame.height));
                    }
                    sprite.addAnimation(anim);
                }
                onload(sprite);
            } else {
                onload(null);
            }
        });
    }
}
