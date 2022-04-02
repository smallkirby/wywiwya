import { Commit, ActionContext } from 'vuex';
import { User as FirestoreUser } from 'firebase/auth';
import { State, User } from './state';
import { Logout } from '~/lib/auth';
import { getUser, setUser } from '~/plugins/firebase';

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
      diaries: [],
    };
    await setUser(_user);

    // set numDiaries
    await dispatch('fetchRemoteUser');
  },

  fetchRemoteUser: async ({ commit, getters }: ActionContext<State, State>) => {
    const me: User = getters.me;
    if (me === null) { return; }
    const user = await getUser(me.uid);
    if (user === null) { return; }
    commit('setUserDiaries', user.diaries);
  },
};

export default actions;
