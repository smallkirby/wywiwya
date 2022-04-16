import firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import { firestore } from '../lib/firebase';
import { isAuthed } from '../lib/auth';
import { DID } from '../diary';

export type UID = string;

export type Kusa = {
  date: Date,
  did: DID,
};

export type User = {
  displayName: string,
  photoURL: string,
  uid: UID,
  diaries: firebase.firestore.DocumentReference[],
  createdAt: number | null, // TODO
  kusa: Kusa[],
}

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

// NOTE: costy
const recalculateKusa = async (uid: UID): Promise<Kusa[] | string> => {
  const userRef = firestore().collection('users').doc(uid);
  const userSnap = await userRef.get();
  const diariesSnap = await firestore().collection('diaries').where('author', '==', uid).get();

  if (!userSnap.exists) {
    return 'while re-calculating kusa, user not found.';
  }
  const kusa: Kusa[] = [];

  diariesSnap.docs.forEach((doc) => {
    kusa.push({
      date: doc.data().createdAt.toDate() as Date,
      did: doc.data().id,
    });
  });

  await userRef.update({
    kusa,
  });

  return kusa;
};

export const addKusa = async (uid: UID, did: string): Promise<string | null> => {
  const userRef = firestore().collection('users').doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    return `User with uid ${uid} not found.`;
  } else {
    const user = userSnap.data();
    if (user === undefined) {
      return 'Somehow, failed to fetch user snapshot.';
    }

    let existingKusa = user.kusa;
    if (existingKusa === undefined || existingKusa === null) {
      existingKusa = [{
        date: new Date(),
        did,
      }];
    } else {
      existingKusa.push({
        date: new Date(),
        did,
      });
    }

    await userRef.update({
      kusa: existingKusa,
    });

    // re-calculate kusa if needed
    if (user.diaries.length !== existingKusa.length) {
      const result = await recalculateKusa(uid);
      if (typeof result === 'string') {
        return result;
      }
    }

    return null;
  }
};

export const removeKusa = async (uid: UID, did: DID): Promise<string | null> => {
  const userRef = firestore().collection('users').doc(uid);
  const userSnap = await userRef.get();
  const kusa = (userSnap.data() as User).kusa;
  const targetIndex = kusa.findIndex((ent) => {
    return ent.did === did;
  });
  if (targetIndex === -1) {
    return null;
  }

  kusa.splice(targetIndex, 1);
  return await userRef.update({
    kusa,
  }).then(() => {
    return null;
  }).catch((e) => {
    return e.toString();
  });
};

export const fetchUsers = async (uids: UID[]): Promise<User[]> => {
  const result: User[] = [];
  // TODO: too costy
  for (const uid of uids) {
    const userSnap = await firestore().collection('users').doc(uid).get();
    if (userSnap.exists) {
      result.push(userSnap.data() as User);
    }
  }

  return result;
};

/***************************/

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

/***************************/

type SearchError = 'invalid-query' | null;
type SearchReturn = {
  err: SearchError,
  users: User[],
}

const doSearchUserFullMatch = async (searchStr: string): Promise<User[]> => {
  const usersSnap = searchStr.length === 0
    ? await firestore().collection('users').orderBy('createdAt', 'desc').get()
    : await firestore().collection('users').where('displayName', '==', searchStr).get();

  const users: User[] = [];
  usersSnap.docs.forEach((doc) => {
    const data = doc.data();
    users.push({
      uid: data.uid,
      photoURL: data.photoURL,
      displayName: data.displayName,
      diaries: data.diaries,
      createdAt: data.createdAt.toDate().getTime(),
      kusa: [],
    });
  });

  return users;
};

export const searchUserFullMatch =
  functions.region('asia-northeast1').https.onCall(async (data): Promise<SearchReturn> => {
    // NOTE: allow unauthenticated user

    const searchStr = data.searchStr;
    const users = await doSearchUserFullMatch(searchStr);
    return {
      err: null,
      users,
    };
  });

type MigrateKusaRet = {
  err: 'auth' | 'update' | null,
};

export const migrateKusa =
  functions.region('asia-northeast1').https.onCall(async (_, context): Promise<MigrateKusaRet> => {
    if (!isAuthed(context.auth!!)) {
      return {
        err: 'auth',
      };
    }

    const newKusa = await recalculateKusa(context.auth!!.uid);
    if (typeof newKusa === 'string') {
      // eslint-disable-next-line no-console
      console.error(newKusa);
      return {
        err: 'update',
      };
    }

    return {
      err: null,
    };
  });
