// eslint-disable-next-line max-len
import { collection, getDocs, getFirestore, query, where, updateDoc, serverTimestamp, orderBy, limit, DocumentSnapshot, collectionGroup, QueryConstraint } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import moment from 'moment';
import { Diary, DID } from '~/typings/diary';
import { User } from '~/store/state';
import { getProjectFirestore, getProjectFunctions } from '~/plugins/firebase';
import { UID } from '~/functions/src/lib/firebase';

const convertDiary = (snap: DocumentSnapshot): Diary => {
  const data = snap.data() as any;
  data.lastUpdatedAt = (data.lastUpdatedAt as any).toDate();
  data.createdAt = (data.createdAt as any).toDate();
  data.id = snap.id;
  return data;
};

const queryAllDiaries = async (...queryConstraints: QueryConstraint[]): Promise<Diary[] | null> => {
  const db = getProjectFirestore();
  const diaryQuery = query(collectionGroup(db, 'diaries'), ...queryConstraints);
  const diariesSnap = await getDocs(diaryQuery).then(snap => snap).catch((e: any) => {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  });

  const convertedDiaries: Diary[] = [];
  if (diariesSnap === null || !diariesSnap.size) {
    return null;
  } else {
    diariesSnap.docs.forEach((doc) => {
      convertedDiaries.push(convertDiary(doc));
    });
    return convertedDiaries;
  }
};

const queryMyDiaries = async (uid: UID, ...queryConstraints: QueryConstraint[]): Promise<Diary[] | null> => {
  const db = getProjectFirestore();
  const diariesRef = collection(db, 'users', uid, 'diaries');
  const diariesQuery = query(diariesRef, ...queryConstraints);

  const diariesSnap = await getDocs(diariesQuery).then(snap => snap).catch((e: any) => {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  });
  if (diariesSnap === null) { return null; }

  const diaries: Diary[] = [];
  diariesSnap.forEach((doc) => {
    diaries.push(convertDiary(doc));
  });

  return diaries;
};

/* ***************************************** */

export const fetchMyDiaryById = async (uid: string, id: string): Promise<Diary | null> => {
  const result = await queryMyDiaries(uid, where('id', '==', id));
  if (result === null || result.length === 0) {
    return null;
  } else {
    return result[0];
  }
};

export const fetchDiaryById = async (id: string): Promise<Diary | null> => {
  const result = await queryAllDiaries(where('id', '==', id), where('isPublic', '==', true));
  if (result === null || result.length === 0) {
    return null;
  } else {
    return result[0];
  }
};

export const fetchMyDiaryByDate = async (uid: UID, did: DID): Promise<Diary | null> => {
  const result = await queryMyDiaries(uid, where('dateID', '==', did));
  if (result === null || result.length === 0) {
    return null;
  } else {
    return result[0];
  }
};

// fetches most recently edited diaries.
export const fetchMyDiaries = async (uid: string, numRequired: number): Promise<Diary[] | null> => {
  if (numRequired <= 0) { numRequired = 1; }

  const result = await queryMyDiaries(uid, orderBy('lastUpdatedAt', 'desc'), limit(numRequired));
  if (result === null || result.length === 0) {
    return null;
  } else {
    return result;
  }
};

export const fetchMyTemporaryDiaries = async (user: User): Promise<Diary[] | null> => {
  const result = await queryMyDiaries(user.uid, where('isTemporary', '==', true), orderBy('lastUpdatedAt', 'desc'));
  if (result === null || result.length === 0) {
    return null;
  } else {
    return result;
  }
};

export const fetchTodaysDiary = async (user: User): Promise<Diary | null> => {
  const todaysDateID = moment().format('YYYY-MM-DD');

  const result = await queryMyDiaries(user.uid, where('dateID', '==', todaysDateID));
  if (result === null || result.length === 0) {
    return null;
  } else {
    return result[0];
  }
};

export const createNewDiary = async (): Promise<DID | null> => {
  const functions = getProjectFunctions();
  const f = httpsCallable(functions, 'createNewDiary');
  return await f({}).then((result) => {
    const data = result.data as any;
    if (data.err !== null) {
      // eslint-disable-next-line no-console
      console.error(data.err);
      return null;
    } else {
      return data.did;
    }
  }).catch((e: any) => {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  });
};

export const updsateDiary = async (diary: Diary): Promise<string | null> => {
  const db = getFirestore();
  const diariesRef = collection(db, 'users', diary.author, 'diaries');
  const diaryQuery = query(diariesRef, where('dateID', '==', diary.dateID));
  const diarySnap = await getDocs(diaryQuery);

  if (diarySnap.size === 0) {
    return 'Somehow, the diary does not exist.';
  }

  const diaryRef = diarySnap.docs[0].ref;
  const newData = {
    isPublic: diary.isPublic,
    isTemporary: diary.isTemporary,
    contentMd: diary.contentMd,
    lastUpdatedAt: serverTimestamp(),
  } as any;
  return await updateDoc(diaryRef, newData).then(() => { return null; })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      return e.toString();
    });
};
