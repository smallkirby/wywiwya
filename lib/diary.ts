/*
 * This file defines functions which communicates with Firestore and Clodu Functions.
 */

import { strict as assert } from 'assert';
import {
  collection,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
  updateDoc,
  serverTimestamp,
  orderBy,
  limit,
  QueryConstraint,
  startAfter,
  doc,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import moment from 'moment';
import { convert2date } from './util/date';
import { Diary, DID } from '~/typings/diary';
import { User } from '~/store/state';
import { getProjectFirestore, getProjectFunctions } from '~/plugins/firebase';
import { UID } from '~/functions/src/lib/firebase';
import { Kusa } from '~/typings/kusa';

/*
 * Convert `Diary` from remote data type into local data type
 */
const convertDiary = (data: Diary): Diary | null => {
  const lastUpdatedAt = convert2date(data.lastUpdatedAt);
  const createdAt = convert2date(data.createdAt);
  if (lastUpdatedAt === null) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse `lastUpdatedAt` of diary.');
    return null;
  }
  if (createdAt === null) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse `createdAt` of diary.');
    return null;
  }
  const diary: Diary = {
    dateID: data.dateID,
    isPublic: data.isPublic,
    isTemporary: data.isTemporary,
    contentMd: data.contentMd,
    author: data.author,
    id: data.id,
    lastUpdatedAt,
    createdAt,
  };
  return diary;
};

const convertDiaries = (data: Diary[]): Diary[] => {
  return data.map((ent) => {
    return convertDiary(ent);
  }).filter((ent) => {
    return ent !== null;
  }) as Diary[];
};

/*
 * Query diaries using constraints.
 */
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

  const datas: Diary[] = [];
  diariesSnap.forEach((doc) => {
    datas.push(doc.data() as Diary);
  });

  return convertDiaries(datas);
};

/* ***************************************** */

/*
 * Fetch a diary based on `Diary.id`.
 */
export const fetchDiaryById = async (uid: string | null, id: string): Promise<Diary | null> => {
  if (uid !== null) {
    const authorDiary = await queryDiaries(where('id', '==', id), where('author', '==', uid));
    if (authorDiary !== null && authorDiary.length !== 0) {
      return authorDiary[0];
    }
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

/*
 * Fetch a diary based on `Diary.dateId`.
 */
export const fetchDiaryByDateId = async (uid: UID, dateID: DID): Promise<Diary | null> => {
  const result = await queryDiaries(where('dateID', '==', dateID), where('author', '==', uid));
  if (result === null || result.length === 0) {
    return null;
  } else {
    return result[0];
  }
};

/*
 * Get DID of the diary right before specified page.
 */
const getDidBeforePage = (page: number, pageLimit: number, kusas: Kusa[], dateQuery: {
  start: Date,
  end: Date,
} | null): DID | null => {
  if (page === 0) { return null; }

  let kusaMoments: Kusa[] = kusas.map((ent) => {
    return {
      date: convert2date(ent.date),
      did: ent.did ? ent.did : '',
    };
  }).filter((ent) => {
    return ent.date !== null;
  }) as Kusa[];

  if (dateQuery !== null) {
    kusaMoments = kusaMoments.filter((ent) => {
      return moment(ent.date).isAfter(moment(dateQuery.start)) && moment(ent.date).isBefore(moment(dateQuery.end));
    });
  }

  if (pageLimit * page > kusas.length) {
    return null;
  }
  const sortedKusa = kusaMoments.sort((a, b) => {
    return b.date.getTime() - a.date.getTime();
  });

  const did = sortedKusa[pageLimit * page - 1].did;
  return did === undefined ? null : did;
};

/*
 * Fetches most recently created diaries.
 * If `dateQuery` is non-null, it returns diaries only within the range.
 */
export const fetchDiaries = async (user: User, numRequired: number, page: number, dateQuery: {
  start: Date,
  end: Date,
} | null = null): Promise<Diary[] | null> => {
  assert(numRequired >= 1);

  let query = [
    where('author', '==', user.uid),
    orderBy('createdAt', 'desc'),
  ];
  if (dateQuery !== null) {
    query = query.concat([
      where('createdAt', '>=', dateQuery.start),
      where('createdAt', '<=', dateQuery.end),
    ]);
  }
  if (page === 0) {
    query = query.concat([
      limit(numRequired),
    ]);
  } else {
    const beforeDid = getDidBeforePage(page, numRequired, user.kusa, dateQuery);
    if (beforeDid === null) {
      return null;
    }

    const db = getProjectFirestore();
    const beforeSnap = await getDoc(doc(db, 'diaries', beforeDid));
    query = query.concat([
      startAfter(beforeSnap),
      limit(numRequired),
    ]);
  }

  const result = await queryDiaries(...query);
  if (result === null) {
    return null;
  } else {
    return result;
  }
};

/*
 * Fetch temporary diaries.
 */
export const fetchTemporaryDiaries = async (user: User): Promise<Diary[] | null> => {
  const result = await queryDiaries(
    where('author', '==', user.uid),
    where('isTemporary', '==', true),
    orderBy('lastUpdatedAt', 'desc'),
  );
  if (result === null) {
    return null;
  } else {
    return result;
  }
};

/*
 * Fetch today's diary.
 */
export const fetchMyTodaysDiary = async (user: User): Promise<Diary | null> => {
  const todaysDateID = moment().format('YYYY-MM-DD');

  const result = await queryDiaries(where('author', '==', user.uid), where('dateID', '==', todaysDateID));
  if (result === null || result.length === 0) {
    return null;
  } else {
    return result[0];
  }
};

/*
 * Create new diary and returns DID of newly created diary.
 */
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

/*
 * Update existing diary.
 */
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

/*
 * Fetch public diaries including others'.
 */
export const fetchOthersPublicDiaries = async (uid: string): Promise<Diary[]> => {
  const functions = getProjectFunctions();
  const f = httpsCallable(functions, 'fetchPublicDiaries');
  return await f({
    uid,
  }).then((result) => {
    // @ts-ignore
    return convertDiaries(result.data as Diary[]);
  }).catch((e: any) => {
    // eslint-disable-next-line no-console
    console.error(e);
    return [];
  });
};
