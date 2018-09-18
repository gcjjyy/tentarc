<template>
  <div class="game">
    <canvas id="canvas"></canvas>
    <div id="resources"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as gcjjyy from '@/gcjjyy';

@Component({
  components: {
  },
})
export default class Game extends Vue {}

let img: gcjjyy.Image;
//let bgm: gcjjyy.Sound;

class Hello extends gcjjyy.Game {
    public onLoad = (): void => {
        console.log('My OnLoad');
        // Load Image
        img = new gcjjyy.Image('tileset.png');

        // Load Music
        //bgm = new gcjjyy.Sound('Defqwop - Awakening [NCS Release].mp3');

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let go = gcjjyy.addGameObject(new gcjjyy.Sprite(img, 32 * j, 32 * i, 16, 16).setPosition(17 * j, 17 * i));
                go.onMouseDown = (x: number, y: number) => {
                    console.log('Index: (' + i + ', ' + j + ')');
                    console.log('Coord: (' + x + ', ' + y + ')');
                }
            }
        }

        //document.body.addEventListener("click", () => { bgm.play(); });
    }

    public onResize = (width: number, height: number): void => {
        //gcjjyy.setDesignedScreenSize(width, height);
    }
}

gcjjyy.run(new Hello(), 480, 270);
</script>

<style scoped>
canvas {
  background-color: black;
  padding: 0;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

#resources {
  display: none;
}
</style>

