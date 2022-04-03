import { State } from '~/store/state';

const getters = {
  me: (state: State) => {
    return state.user;
  },

  isLoggedIn: (state: State) => {
    return state.user !== null && state.user !== 'trying';
  },
};

export default getters;
