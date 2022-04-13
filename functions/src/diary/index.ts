import * as functions from 'firebase-functions';
import firebase from 'firebase-admin';
import moment from 'moment';
import { firestore } from '../lib/firebase';
import { addDiaryRef, addKusa, UID } from '../user';
import { isAuthed } from '../lib/auth';

// @typings/diary.d.ts
export type DID = string;
export type DateID = string;
export type Diary = {
  dateID: DateID,
  createdAt: firebase.firestore.FieldValue,
  lastUpdatedAt: firebase.firestore.FieldValue,
  isPublic: boolean,
  isTemporary: boolean,
  contentMd: string,
  author: UID,
  id?: string,
};

type ErrorCode = 'forbidden' | 'already-exist' | 'failure-update-user' | 'failure-update-kusa';

type ReturnType = {
  err: ErrorCode | null,
  did: string | null,
};

const fetchDiaryByDate = async (uid: string, dateID: string) => {
  const diarySnap = await firestore()
    .collection('diaries')
    .where('author', '==', uid)
    .where('dateID', '==', dateID)
    .get();
  if (diarySnap.size === 0) {
    return null;
  } else {
    return diarySnap.docs[0].data();
  }
};

// FIXME: BUG: may cause TOCTOU race condition
const isValidCreate = async (uid: string): Promise<boolean> => {
  const todaysString = moment().format('YYYY-MM-DD');
  const diary = await fetchDiaryByDate(uid, todaysString);
  return diary === null;
};

// FIXME: BUG: may cause TOCTOU race condition
const doCreateNewDiary = async (uid: string): Promise<firebase.firestore.DocumentReference> => {
  const todaysString = moment().format('YYYY-MM-DD');
  const newData: Diary = {
    dateID: todaysString,
    isPublic: true,
    isTemporary: false,
    contentMd: '',
    author: uid,
    createdAt: firestore.FieldValue.serverTimestamp(),
    lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
  };
  const diariesRef = await firestore()
    .collection('diaries')
    .add(newData)
    .then(async (res) => {
      await res.set({
        id: res.id,
        ...newData,
      });
      return res;
    });

  return diariesRef;
};

export const createNewDiary =
  functions.region('asia-northeast1').https.onCall(async (_, context): Promise<ReturnType> => {
    if (!isAuthed(context.auth)) {
      return {
        err: 'forbidden',
        did: null,
      };
    }
    if (!(await isValidCreate(context.auth!!.uid))) {
      return {
        err: 'already-exist',
        did: null,
      };
    }

    // create new diary in Firestore.
    const newDiary = await doCreateNewDiary(context.auth!!.uid);

    // add reference of newly created diary into user
    const resultAddRef = await addDiaryRef(context.auth!!.uid, newDiary);
    if (resultAddRef !== null) {
      // eslint-disable-next-line no-console
      console.error(resultAddRef);
      return {
        err: 'failure-update-user',
        did: newDiary.id,
      };
    }

    // add kusa
    const resultAddKusa = await addKusa(context.auth!!.uid, newDiary.id);
    if (resultAddKusa !== null) {
      // eslint-disable-next-line no-console
      console.error(resultAddKusa);
      return {
        err: 'failure-update-kusa', // TODO should remove new diary and ref
        did: newDiary.id,
      };
    }

    return {
      err: null,
      did: newDiary.id,
    };
  });

// NOTE: CAREFUL: SECURITY
export const fetchPublicDiaries =
  functions.region('asia-northeast1').https.onCall(async (data): Promise<Diary[]> => {
    // NOTE: allow unauthenticated users

    const targetUid = data.uid;

    const diaries = await firestore()
      .collection('diaries')
      .where('author', '==', targetUid)
      .where('isPublic', '==', true)
      .where('isTemporary', '==', false)
      .get();

    const returns: Diary[] = [];
    diaries.docs.forEach((doc) => {
      const data = doc.data() as Diary;
      returns.push({
        ...data,
        lastUpdatedAt: (data.lastUpdatedAt as any).toDate().getTime(),
        createdAt: (data.createdAt as any).toDate().getTime(),
      });
    });
    return returns;
  });
