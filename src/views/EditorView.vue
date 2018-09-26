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
import Screen from '@/engine/Screen';
import LogoScene from '@/LogoScene';

@Component({
  components: {
  },
})
export default class EditorView extends Vue {
  private fullSize: boolean = false;
  private screen: Screen;
  private screen2: Screen;

  constructor() {
    super();

    this.screen = new Screen('canvas1', 480, 270);
    this.screen2 = new Screen('canvas2', 128, 128);

    this.screen.onLoad = (): void => {
        this.screen.pushScene(new LogoScene(this.screen));
    };

    this.screen2.onLoad = (): void => {
        this.screen2.pushScene(new LogoScene(this.screen2));
    };

    this.screen.onResize = (width: number, height: number): void => {
        if (this.fullSize) {
            this.screen.setDesignedScreenSize(width, height);
        }
    };

    this.screen2.onResize = (width: number, height: number): void => {
        if (this.fullSize) {
            this.screen2.setDesignedScreenSize(width, height);
        }
    };

    this.screen.run();
    this.screen2.run();
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

