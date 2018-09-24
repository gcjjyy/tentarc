import Vue from 'vue';
import Router from 'vue-router';
import GameView from './views/GameView.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'game',
      component: GameView,
    },
  ],
});
