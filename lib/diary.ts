import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import moment from 'moment';
import { Diary } from '~/typings/diary';
import { User } from '~/store/state';

export const fetchDiary = async (uid: string, did: string): Promise<Diary | null> => {
  const db = getFirestore();
  const diaryRef = doc(db, 'users', uid, 'diaries', did);
  const diarySnap = await getDoc(diaryRef).then(snap => snap).catch(() => {
    return null;
  });

  if (diarySnap === null || !diarySnap.exists()) {
    return null;
  } else {
    return diarySnap.data() as Diary;
  }
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
    return diarySnap.docs[0].data() as Diary;
  }
};
