// eslint-disable-next-line max-len
import { collection, getDocs, getFirestore, query, where, updateDoc, serverTimestamp, orderBy, limit, DocumentSnapshot, QueryConstraint } from 'firebase/firestore';
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

const queryDiaries = async (...queryConstraints: QueryConstraint[]): Promise<Diary[] | null> => {
  const db = getProjectFirestore();
  const diariesRef = collection(db, 'diaries');
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

export const fetchDiaryById = async (uid: string, id: string): Promise<Diary | null> => {
  const authorDiary = await queryDiaries(where('id', '==', id), where('author', '==', uid));
  if (authorDiary !== null && authorDiary.length !== 0) {
    return authorDiary[0];
  }
  const othersDiary = await queryDiaries(
    where('id', '==', id),
    where('isTemporary', '==', false),
    where('isPublic', '==', true),
  );
  if (othersDiary !== null && othersDiary.length !== 0) {
    return othersDiary[0];
  } else {
    return null;
  }
};

export const fetchMyDiaryByDate = async (uid: UID, did: DID): Promise<Diary | null> => {
  const result = await queryDiaries(where('dateID', '==', did), where('author', '==', uid));
  if (result === null || result.length === 0) {
    return null;
  } else {
    return result[0];
  }
};

// fetches most recently edited diaries.
export const fetchMyDiaries = async (uid: string, numRequired: number): Promise<Diary[] | null> => {
  if (numRequired <= 0) { numRequired = 1; }

  const result = await queryDiaries(where('author', '==', uid), orderBy('lastUpdatedAt', 'desc'), limit(numRequired));
  if (result === null || result.length === 0) {
    return null;
  } else {
    return result;
  }
};

export const fetchMyTemporaryDiaries = async (user: User): Promise<Diary[] | null> => {
  const result = await queryDiaries(
    where('author', '==', user.uid),
    where('isTemporary', '==', true),
    orderBy('lastUpdatedAt', 'desc'),
  );
  if (result === null || result.length === 0) {
    return null;
  } else {
    return result;
  }
};

export const fetchMyTodaysDiary = async (user: User): Promise<Diary | null> => {
  const todaysDateID = moment().format('YYYY-MM-DD');

  const result = await queryDiaries(where('author', '==', user.uid), where('dateID', '==', todaysDateID));
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

export const updateDiary = async (diary: Diary): Promise<string | null> => {
  const db = getFirestore();
  const diariesRef = collection(db, 'diaries');
  const diaryQuery = query(diariesRef,
    where('dateID', '==', diary.dateID),
    where('author', '==', diary.author),
  );
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
