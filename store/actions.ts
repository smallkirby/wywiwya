import { Commit, ActionContext } from 'vuex';
import { User as FirestoreUser } from 'firebase/auth';
import { State } from './state';
import { Logout } from '~/lib/auth';
import { fetchUser, setUser } from '~/lib/user';

const actions = {
  signout: async ({ commit }: {commit: Commit}) => {
    commit('clearUser');
    await Logout();
  },

  // Fetch user information from Firestore based on provider information.
  setUser: async ({ commit }: ActionContext<State, State>, { user }: { user: FirestoreUser }) => {
    let me = await fetchUser(user.uid);
    if (me === null) {
      const result = await setUser({
        uid: user.uid,
        photoURL: user.photoURL ? user.photoURL : '',
        displayName: user.displayName ? user.displayName : '',
        diaries: [],
        createdAt: null,
        kusa: [],
      });
      if (result === false) {
        // eslint-disable-next-line no-console
        console.error('Failed to create new user...'); // TODO
        commit('commitUser', null);
        return;
      }

      // fetch again
      me = await fetchUser(user.uid);
      if (me === null) {
        // eslint-disable-next-line no-console
        console.error('Failed to create new user...'); // TODO
        commit('commitUser', null);
        return;
      }
    }

    // set numDiaries
    commit('commitUser', me);
  },
};

export default actions;
