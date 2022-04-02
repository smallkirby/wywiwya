import firebase from 'firebase-admin';
import { firestore } from '../lib/firebase';

export type UID = string;

export const addDiaryRef =
  async (uid: string, newDiaryRef: firebase.firestore.DocumentReference): Promise<string | null> => {
    const userRef = firestore().collection('users').doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return `User with uid ${uid} not found.`;
    } else {
      const user = userSnap.data();
      if (user === undefined) {
        return 'Somehow, failed to fetch user snapshot.';
      }

      const existingDiaries = user.diaries;
      existingDiaries.push(newDiaryRef);

      await userRef.update({
        diaries: existingDiaries,
      });

      return null;
    }
  };
