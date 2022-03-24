import { State } from '~/store/state';

const getters = {
  me: (state: State) => {
    return state.user;
  },

  isLoggedIn: (state: State) => {
    return state.user !== null && state.user.uid.length > 0;
  },
};

export default getters;
