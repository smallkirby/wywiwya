// eslint-disable-next-line max-len
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { User, UID } from '~/store/state';

export const fetchUser = async (uid: UID): Promise<User | null> => {
  const db = getFirestore();
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  } else {
    return userSnap.data() as User;
  }
};
