import { LoginState, State } from '~/store/state';

const mutations = {
  clearUser: (state: State) => {
    state.user = null;
  },

  commitUser: (state: State, user: LoginState) => {
    state.user = user;
  },
};

export default mutations;
