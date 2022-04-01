// eslint-disable-next-line max-len
import { collection, doc, getDoc, getDocs, getFirestore, query, where, updateDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import moment from 'moment';
import { Diary, DID } from '~/typings/diary';
import { User } from '~/store/state';
import { getProjectFirestore, getProjectFunctions } from '~/plugins/firebase';

const convertDiary = (diary: Diary): Diary => {
  diary.lastUpdatedAt = (diary.lastUpdatedAt as any).toDate();
  diary.createdAt = (diary.createdAt as any).toDate();
  return diary;
};

export const fetchDiary = async (uid: string, did: string): Promise<Diary | null> => {
  const db = getProjectFirestore();
  const diaryRef = doc(db, 'users', uid, 'diaries', did);
  const diarySnap = await getDoc(diaryRef).then(snap => snap).catch(() => {
    return null;
  });

  if (diarySnap === null || !diarySnap.exists()) {
    return null;
  } else {
    return convertDiary(diarySnap.data() as Diary);
  }
};

// fetches most recently edited diaries.
export const fetchDiaries = async (uid: string, numRequired: number): Promise<Diary[] | null> => {
  if (numRequired <= 0) { numRequired = 1; }

  const db = getProjectFirestore();
  const diariesRef = collection(db, 'users', uid, 'diaries');
  const diariesQuery = query(diariesRef, orderBy('lastUpdatedAt', 'desc'), limit(numRequired));

  const diariesSnap = await getDocs(diariesQuery).then(snap => snap).catch((e: any) => {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  });
  if (diariesSnap === null) { return null; }

  const diaries: Diary[] = [];
  diariesSnap.forEach((doc) => {
    const data = doc.data();
    diaries.push(convertDiary(data as Diary));
  });

  return diaries;
};

export const fetchTemporaryDiaries = async (user: User): Promise<Diary[] | null> => {
  const db = getFirestore();
  const diariesRef = collection(db, 'users', user.uid, 'diaries');
  const tempDiariesQuery = query(diariesRef, where('isTemporary', '==', true));

  const diariesSnap = await getDocs(tempDiariesQuery).then(snap => snap).catch((e: any) => {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  });
  if (diariesSnap === null) { return null; }

  const tempDiaries: Diary[] = [];
  diariesSnap.forEach((doc) => {
    const data = doc.data();
    tempDiaries.push(convertDiary(data as Diary));
  });
  return tempDiaries;
};

export const fetchTodaysDiary = async (user: User): Promise<Diary | null> => {
  const todaysDateID = moment().format('YYYY-MM-DD');

  const db = getFirestore();
  const diariesRef = collection(db, 'users', user.uid, 'diaries');
  const todayQuery = query(diariesRef, where('dateID', '==', todaysDateID));

  const diarySnap = await getDocs(todayQuery).then(snap => snap).catch((e: any) => {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  });
  if (diarySnap === null) { return null; }

  if (diarySnap.size === 0) {
    return null;
  } else {
    const diary = diarySnap.docs[0].data() as Diary;
    return convertDiary(diary);
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
