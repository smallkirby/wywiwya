import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Store } from 'vuex';
import { isValidUser } from '~/lib/auth';
import { isAppInitialized } from '~/plugins/firebase';
import { State } from '~/store/state';

export default ({ store }: {store: Store<State>}) => {
  if (!isAppInitialized()) {
    return;
  }

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (isValidUser(user)) {
        store.dispatch('setUser', { user });
      } else {
        // eslint-disable-next-line no-console
        console.error('Login Failed');
      }
    }
  });
};
