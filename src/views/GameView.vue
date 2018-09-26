<template>
  <div style="height: 100%; height: 100%; background-color: black; display: flex; align-items: center; justify-content: center;">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Screen from '@/engine/Screen';
import LogoScene from '@/LogoScene';

@Component({
  components: {
  },
})
export default class GameView extends Vue {
  private fullSize: boolean = false;
  private screen: Screen;

  constructor() {
    super();

    this.screen = new Screen('canvas', 480, 270);

    this.screen.onLoad = (): void => {
        this.screen.pushScene(new LogoScene(this.screen));
    };

    this.screen.onResize = (width: number, height: number): void => {
        if (this.fullSize) {
            this.screen.setDesignedScreenSize(width, height);
        }
    };

    this.screen.run();
  }
}
</script>

<style scoped>
#canvas {
  background-color: black;
}
</style>

