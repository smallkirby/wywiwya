import Vue from 'vue';
// eslint-disable-next-line import/no-named-as-default
import VueLoading, { VueLoadingOptions } from 'vue-loading-template';

Vue.use<VueLoadingOptions>(VueLoading, {
  type: 'spiningDubbles',
  size: {
    width: '100px',
    height: '100px',
  },
});

export default () => { };
