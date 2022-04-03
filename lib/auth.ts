import { GithubAuthProvider, getAuth, signInWithPopup, User } from 'firebase/auth';
import { LoginState } from '~/store/state';

const provider = new GithubAuthProvider();

export const isValidProviderUser = (user: User | null): boolean => {
  if (user === null) { return false; }
  return !user.isAnonymous && user.uid.length !== 0 && user.providerId === 'firebase';
};

export const isValidUser = (user: LoginState): boolean => {
  return user !== 'trying' && user !== null && user.uid.length !== 0;
};

export const Login = async (): Promise<null | string> => {
  const auth = getAuth();
  return await signInWithPopup(auth, provider).then(() => {
    return null;
  }).catch((e: any) => {
    return e.toString();
  });
};

export const Logout = async () => {
  const auth = getAuth();
  await auth.signOut();
};
