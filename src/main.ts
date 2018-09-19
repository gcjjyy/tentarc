import Vue from 'vue';
import App from './App.vue';
import router from './router';

import Game from '@/engine/Game';
import LogoScene from './LogoScene';
import GameScene from './GameScene';

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');

class Hello extends Game {
    private fullSize: boolean = false;

    public onLoad = (): void => {
        console.log('My OnLoad');

        this.pushScene(new LogoScene(this, this.designedWidth, this.designedHeight));
    }

    public onResize = (width: number, height: number): void => {
        if (this.fullSize) {
            this.setDesignedScreenSize(width, height);
        }
    }
}

const hello: Hello = new Hello('canvas1', 256, 192);
hello.run();

const hello2: Hello = new Hello('canvas2', 128, 128);
hello2.run();
