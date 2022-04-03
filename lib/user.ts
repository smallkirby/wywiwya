// eslint-disable-next-line max-len
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getProjectFunctions } from '~/plugins/firebase';
import { User, UID } from '~/store/state';

export const fetchUser = async (uid: UID): Promise<User | null> => {
  const db = getFirestore();
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  } else {
    return userSnap.data() as User;
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
      return users;
    } else if (error === 'invalid-query') {
      return '検索文字列に不正な文字が含まれています。';
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
      return users;
    } else if (error === 'invalid-query') {
      return '検索文字列に不正な文字が含まれています。';
    } else {
      return '不明なエラーが発生しました。時間をおいて再度試してください。';
    }
  }).catch((e: any) => {
    return e.toString();
  });
};
