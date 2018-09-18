<template>
  <div class="game">
    <canvas id="canvas"></canvas>
    <div id="resources"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Game extends Vue {}
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

