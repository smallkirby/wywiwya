import { firestore } from '../lib/firebase';

export type UID = string;

export const incrementNumDiaries = async (uid: string): Promise<string | null> => {
  const userRef = firestore().collection('users').doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    return `User with uid ${uid} not found.`;
  } else {
    const user = userSnap.data();
    if (user === undefined) {
      return 'Somehow, failed to fetch user snapshot.';
    }
    const currentNumDiaries: number = user.numDiaries;

    await userRef.update({
      numDiaries: currentNumDiaries + 1,
    });

    return null;
  }
};
