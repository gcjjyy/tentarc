<template>
  <div>
    <div style="background-color: yellow;">
      <canvas id="canvas1"></canvas>
    </div>
    <div style="background-color: green;">
      <canvas id="canvas2"></canvas>
    </div>
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
#canvas1 {
  background-color: black;
}

#canvas2 {
  background-color: blue;
}
</style>

