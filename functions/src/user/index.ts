import firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import { firestore } from '../lib/firebase';
import { isAuthed } from '../lib/auth';

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

type NameChangeError = 'duplicate-name' | 'forbidden' | 'not-exist' | 'empty' | 'invalid-chr' | null;
type NameChangeRet = {
  err: NameChangeError | null,
};

const invalidNameChrs = [' ', '\n'];

const isValidName = async (newName: string): Promise<NameChangeError> => {
  if (newName.length === 0) {
    return 'empty';
  }
  for (const invalidCh of invalidNameChrs) {
    if (newName.includes(invalidCh)) {
      return 'invalid-chr';
    }
  }

  const usersSnaps = await firestore().collection('users').where('displayName', '==', newName).get();
  if (usersSnaps.size === 0) {
    return null;
  } else {
    return 'duplicate-name';
  }
};

const doChangeUserName = async (uid: string, newName: string): Promise<NameChangeError> => {
  const userRef = firestore().collection('users').doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    return 'not-exist';
  }

  await userRef.update({
    displayName: newName,
  }).catch((e: any) => {
    // eslint-disable-next-line no-console
    console.error(e);
  });
  return null;
};

export const changeUserName =
  functions.region('asia-northeast1').https.onCall(async (data, context): Promise<NameChangeRet> => {
    if (!isAuthed(context.auth)) {
      return {
        err: 'duplicate-name',
      };
    }
    const uid = context.auth!!.uid;

    const isValid = await isValidName(data.newName);
    if (isValid !== null) {
      return {
        err: isValid,
      };
    }

    const error = await doChangeUserName(uid, data.newName);
    return {
      err: error,
    };
  });
