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

