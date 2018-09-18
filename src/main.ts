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
let img: Image;
let bgm: Sound;

class Hello extends Game {
    public onLoad = (): void => {
        console.log('My OnLoad');
        // Load Image
        img = new Image('tileset.png');

        // Load Music
        bgm = new Sound('Beethoven_12_Variation.mp3');

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const go = Game.addGameObject(new Sprite(img, 32 * j, 32 * i, 16, 16).setPosition(17 * j, 17 * i));
                go.onMouseDown = (x: number, y: number) => {
                    console.log('Index: (' + i + ', ' + j + ')');
                    console.log('Coord: (' + x + ', ' + y + ')');
                };
            }
        }

        document.body.addEventListener('click', () => { bgm.play(); });
    }

    public onResize = (width: number, height: number): void => {
        Game.setDesignedScreenSize(width, height);
    }
}

const hello: Hello = new Hello(480, 270);
hello.run();
