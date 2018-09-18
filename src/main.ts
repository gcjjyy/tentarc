import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Game from '@/engine/Game';
import GameObject from '@/engine/GameObject';
import Image from '@/engine/Image';
import Sound from '@/engine/Sound';
import Sprite from '@/engine/Sprite';

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');

// Main Game Logic
class Hello extends Game {
    private fullSize: boolean = false;
    private img: Image | null = null;
    private bgm: Sound | null = null;

    public onLoad = (): void => {
        console.log('My OnLoad');
        // Load Image
        this.img = new Image(this, 'tileset.png');

        // Load Music
        this.bgm = new Sound(this, 'Beethoven_12_Variation.mp3');

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const go = this.addGameObject(
                    new Sprite(this, this.img, 32 * j, 32 * i, 16, 16).setPosition(17 * j, 17 * i));

                if (i !== j) {
                    go.onMouseDown = (x: number, y: number) => {
                        console.log('[' + this.canvasId + '] Index: (' + i + ', ' + j +
                            ') offset: (' + x + ', ' + y + ')');
                    };
                }
            }
        }

        document.body.addEventListener('click', () => { if (this.bgm) { this.bgm.play(); } });
    }

    public onResize = (width: number, height: number): void => {
        if (this.fullSize) {
            this.setDesignedScreenSize(width, height);
        }
    }
}

const hello: Hello = new Hello('canvas1', 480, 270);
hello.run();

const hello2: Hello = new Hello('canvas2', 500, 300);
hello2.run();
