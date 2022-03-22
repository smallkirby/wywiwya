import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { isAppInitialized } from '~/plugins/firebase';

export default () => {
  if (!isAppInitialized()) {
    return;
  }

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // eslint-disable-next-line no-console
      console.log(user);
    } else {
      // eslint-disable-next-line no-console
      console.log(user);
    }
  });
};
