import { State, User } from '~/store/state';

const mutations = {
  setUser: (state: State, { user }:{ user: User }) => {
    state.user = {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  },

  clearUser: (state: State) => {
    state.user = null;
  },
};

export default mutations;
