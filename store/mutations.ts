import { State, User } from '~/store/state';

const mutations = {
  setUser: (state: State, { user }:{ user: User }) => {
    state.user = {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      numDiaries: 0,
    };
  },

  clearUser: (state: State) => {
    state.user = null;
  },

  setNumDiaries: (state: State, num: number) => {
    if (state.user !== null) {
      state.user.numDiaries = num;
    }
  },
};

export default mutations;
