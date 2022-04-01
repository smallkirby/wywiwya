import * as functions from 'firebase-functions';
import firebase from 'firebase-admin';
import moment from 'moment';
import { firestore } from '../lib/firebase';
import { incrementNumDiaries, UID } from '../user';
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
};

type ErrorCode = 'forbidden' | 'already-exist' | 'failure-update-user';

type ReturnType = {
  err: ErrorCode | null,
  did: DID,
};

const fetchDiaryByDate = async (uid: string, dateID: string) => {
  const diarySnap = await firestore()
    .collection('users')
    .doc(uid)
    .collection('diaries')
    .where('dateID', '==', dateID).get();
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
const doCreateNewDiary = async (uid: string): Promise<DID> => {
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
  const diariesRef = await firestore().collection('users').doc(uid).collection('diaries').add(newData);
  return diariesRef.id;
};

export const createNewDiary =
  functions.region('asia-northeast1').https.onCall(async (_, context): Promise<ReturnType> => {
    if (!isAuthed(context.auth)) {
      return {
        err: 'forbidden',
        did: '',
      };
    }
    if (!(await isValidCreate(context.auth!!.uid))) {
      return {
        err: 'already-exist',
        did: '',
      };
    }

    // create new diary in Firestore.
    const did = await doCreateNewDiary(context.auth!!.uid);

    // increment # of diaries in Firestore.
    const result = await incrementNumDiaries(context.auth!!.uid);
    if (result !== null) {
      // eslint-disable-next-line no-console
      console.error(result);
      return {
        err: 'failure-update-user',
        did,
      };
    } else {
      return {
        err: null,
        did,
      };
    }
  });
