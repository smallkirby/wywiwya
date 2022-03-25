import { Commit } from 'vuex';
import { User as FirestoreUser } from 'firebase/auth';
import { User } from './state';
import { Logout } from '~/lib/auth';
import { setUser } from '~/plugins/firebase';

const actions = {
  signout: async ({ commit }: {commit: Commit}) => {
    await Logout();
    commit('clearUser');
  },

  setUser: async ({ commit }: {commit: Commit}, { user }: { user: FirestoreUser }) => {
    // set in store
    commit('setUser', { user });

    // set to FireStore
    const _user: User = {
      photoURL: user.photoURL!!,
      uid: user.uid,
      displayName: user.displayName!!,
    };
    await setUser(_user);
  },
};

export default actions;
