import { onAuthStateChanged, Unsubscribe } from 'firebase/auth';
import { Store } from 'vuex';
import { isValidProviderUser, isValidUser } from '~/lib/auth';
import { getProjectAuth, isAppInitialized } from '~/plugins/firebase';
import { State } from '~/store/state';

let unsubscribe: null | Unsubscribe = null;

export default ({ store }: {store: Store<State>}) => {
  if (!isAppInitialized()) {
    return;
  }
  const auth = getProjectAuth();

  const me = store.getters.me;
  store.commit('commitUser', 'trying');
  if (!isValidUser(me)) {
    if (unsubscribe === null) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          if (isValidProviderUser(user)) {
            await store.dispatch('setUser', { user });
          } else {
            // eslint-disable-next-line no-console
            console.error('Login Failed');
            store.commit('commitUser', null);
          }
        } else {
          store.commit('commitUser', null);
        }
      });
    } else {
      store.commit('commitUser', me);
    }
  } else {
    store.commit('commitUser', me);
  }
};
