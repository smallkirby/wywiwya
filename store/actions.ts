import { Commit } from 'vuex';
import { Logout } from '~/lib/auth';

const actions = {
  signout: async ({ commit }: {commit: Commit}) => {
    await Logout();
    commit('clearUser');
  },
};

export default actions;
