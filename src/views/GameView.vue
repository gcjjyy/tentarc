<template>
  <div style="height: 100%;">
    <div style="width: 100%; height: 50%; background-color: yellow; display: flex; align-items: center; justify-content: center;">
      <canvas id="canvas1"></canvas>
    </div>
    <div style="width: 100%; height: 50%; background-color: green; display: flex; align-items: center; justify-content: center;">
      <canvas id="canvas2"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Game from '@/engine/Game';
import LogoScene from '@/LogoScene';

@Component({
  components: {
  },
})
export default class GameView extends Vue {
  private fullSize: boolean = false;
  private game: Game;
  private game2: Game;

  constructor() {
    super();

    this.game = new Game('canvas1', 480, 270);
    this.game2 = new Game('canvas2', 128, 128);

    this.game.onLoad = (): void => {
        this.game.pushScene(new LogoScene(this.game));
    };

    this.game2.onLoad = (): void => {
        this.game2.pushScene(new LogoScene(this.game2));
    };

    this.game.onResize = (width: number, height: number): void => {
        if (this.fullSize) {
            this.game.setDesignedScreenSize(width, height);
        }
    };

    this.game2.onResize = (width: number, height: number): void => {
        if (this.fullSize) {
            this.game2.setDesignedScreenSize(width, height);
        }
    };

    this.game.run();
    this.game2.run();
  }
}
</script>

<style scoped>
#canvas1 {
  background-color: black;
}

#canvas2 {
  background-color: blue;
}
</style>

