import { Commit, ActionContext } from 'vuex';
import { User as FirestoreUser } from 'firebase/auth';
import { State, User } from './state';
import { Logout } from '~/lib/auth';
import { getNumDiaries, setUser } from '~/plugins/firebase';

const actions = {
  signout: async ({ commit }: {commit: Commit}) => {
    await Logout();
    commit('clearUser');
  },

  setUser: async ({ commit, dispatch }: ActionContext<State, State>, { user }: { user: FirestoreUser }) => {
    // set in store
    commit('setUser', { user });

    // set to FireStore
    const _user: User = {
      photoURL: user.photoURL!!,
      uid: user.uid,
      displayName: user.displayName!!,
      numDiaries: null,
    };
    await setUser(_user);

    // set numDiaries
    await dispatch('getUpdateNumDiaries');
  },

  getUpdateNumDiaries: async ({ commit, getters }: ActionContext<State, State>) => {
    const me = getters.me;
    if (me === null) { return; }
    const numDiaries = await getNumDiaries(me);
    if (numDiaries === null) { return; }
    commit('setNumDiaries', numDiaries);
  },
};

export default actions;
