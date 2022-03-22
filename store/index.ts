import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import state from './state';

Vue.use(Vuex);

export default () => {
  return new Store({
    state,
    getters,
    mutations,
    actions,
  });
};
