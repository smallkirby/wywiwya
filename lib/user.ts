// eslint-disable-next-line max-len
import { doc, getDoc, getFirestore, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getProjectFunctions, getProjectFirestore } from '~/plugins/firebase';
import { User, UID } from '~/store/state';

// convert user in the server user.
function convertServerUser (user: User): User;
// eslint-disable-next-line no-redeclare
function convertServerUser (user: User[]): User[];
// eslint-disable-next-line no-redeclare
function convertServerUser (user: any): any {
  if (user.constructor === Array) {
    return user.map((ent) => {
      if (ent.kusa === undefined) {
        ent.kusa = [];
      }
      if (ent.readNotifications === undefined) {
        ent.readNotifications = [];
      }
      return ent;
    });
  } else {
    if (user.kusa === undefined) {
      user.kusa = [];
    }
    if (user.readNotifications === undefined) {
      user.readNotifications = [];
    }
    return user;
  }
};

export const setUser = async (user: User): Promise<boolean> => {
  const db = getProjectFirestore();
  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const existingUser = userDocSnap.data();
    if (existingUser === user) {
      return true;
    } else {
      return await updateDoc(userDocRef, {
        photoURL: user.photoURL,
        displayName: user.displayName,
      }).then(() => {
        return true;
      }).catch((reason: any) => {
        // eslint-disable-next-line no-console
        console.error(reason);
        return false;
      });
    }
  } else {
    // create new user
    return await setDoc(doc(db, 'users', user.uid), {
      photoURL: user.photoURL,
      uid: user.uid,
      displayName: user.displayName,
      diaries: [],
      kusa: [],
      readNotifications: [],
      createdAt: serverTimestamp(),
    }).then(() => {
      return true;
    }).catch((reason: any) => {
      // eslint-disable-next-line no-console
      console.error(reason);
      return false;
    });
  }
};

export const fetchUser = async (uid: UID): Promise<User | null> => {
  const db = getFirestore();
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  } else {
    return convertServerUser(userSnap.data() as User);
  }
};

export const changeDisplayName = async (newName: string): Promise<string | null> => {
  const functions = getProjectFunctions();
  const f = httpsCallable(functions, 'changeUserName');
  return await f({
    newName,
  }).then((result) => {
    const error = (result.data as any).err;
    if (error === null) {
      return null;
    } else if (error === 'duplicate-name') {
      return '既に他のユーザが使用しています。';
    } else if (error === 'empty') {
      return '空文字列は登録できません。';
    } else if (error === 'invalid-chr') {
      return '名前の中に不正な文字が入っています。';
    } else if (error === 'forbidden' || error === 'not-exist') {
      return '更新に失敗しました。競合状態にあるかもしれません。';
    } else {
      return '不明なエラーが発生しました。時間をおいて再度試してください。';
    }
  }).catch((e: any) => {
    return e.toString();
  });
};

export const searchUserFullMatch = async (name: string): Promise<string | User[]> => {
  const functions = getProjectFunctions();
  const f = httpsCallable(functions, 'searchUserFullMatch');
  return await f({
    searchStr: name,
  }).then((result) => {
    const error = (result.data as any).err;
    const users = (result.data as any).users;
    if (error === null) {
      return convertServerUser(users);
    } else if (error === 'invalid-query') {
      return '検索文字列に不正な文字が含まれています。';
    } else {
      return '不明なエラーが発生しました。時間をおいて再度試してください。';
    }
  }).catch((e: any) => {
    return e.toString();
  });
};

export const searchUserPartialMatch = async (name: string): Promise<string | User[]> => {
  const functions = getProjectFunctions();
  const f = httpsCallable(functions, 'searchUserPartial');
  return await f({
    searchStr: name,
  }).then((result) => {
    const error = (result.data as any).err;
    const users = (result.data as any).users;
    if (error === null) {
      return convertServerUser(users);
    } else if (error === 'invalid-query') {
      return '検索クエリが正しくありません。';
    } else if (error === 'rate-limit') {
      return '一日の検索可能上限に達しました。';
    } else {
      return '不明なエラーが発生しました。時間をおいて再度試してください。';
    }
  }).catch((e: any) => {
    return e.toString();
  });
};

export const getAllUsers = async (): Promise<string | User[]> => {
  const functions = getProjectFunctions();
  const f = httpsCallable(functions, 'searchUserFullMatch');
  return await f({
    searchStr: '',
  }).then((result) => {
    const error = (result.data as any).err;
    const users = (result.data as any).users;
    if (error === null) {
      return convertServerUser(users);
    } else if (error === 'invalid-query') {
      return '検索文字列に不正な文字が含まれています。';
    } else {
      return '不明なエラーが発生しました。時間をおいて再度試してください。';
    }
  }).catch((e: any) => {
    return e.toString();
  });
};

export const setUserNotificationRead = async (uid: string, readNotifications: string[]) => {
  const db = getFirestore();
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    readNotifications,
  }).catch((e: any) => {
    // eslint-disable-next-line no-console
    console.error(e);
  });
};
