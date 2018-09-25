<template>
  <div style="height: 100%; height: 100%; background-color: black; display: flex; align-items: center; justify-content: center;">
    <canvas id="canvas"></canvas>
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

  constructor() {
    super();

    this.game = new Game('canvas', 480, 270);

    this.game.onLoad = (): void => {
        this.game.pushScene(new LogoScene(this.game));
    };

    this.game.onResize = (width: number, height: number): void => {
        if (this.fullSize) {
            this.game.setDesignedScreenSize(width, height);
        }
    };

    this.game.run();
  }
}
</script>

<style scoped>
#canvas {
  background-color: black;
}
</style>

