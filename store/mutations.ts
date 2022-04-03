import { LoginState, State } from '~/store/state';

const mutations = {
  clearUser: (state: State) => {
    state.user = null;
  },

  commitUser: (state: State, user: LoginState) => {
    state.user = user;
  },

  commitUserName: (state: State, newName: string) => {
    if (state.user !== null && state.user !== 'trying') {
      state.user.displayName = newName;
    }
  },
};

export default mutations;
