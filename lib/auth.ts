import { GithubAuthProvider, getAuth, signInWithPopup, User } from 'firebase/auth';

const provider = new GithubAuthProvider();

export const isValidUser = (user: User | null): boolean => {
  if (user === null) { return false; }
  return !user.isAnonymous && user.uid.length !== 0 && user.providerId === 'firebase';
};

export const Login = async () => {
  const auth = getAuth();
  const result = await signInWithPopup(auth, provider);
  const credential = GithubAuthProvider.credentialFromResult(result);
  return credential;
};

export const Logout = async () => {
  const auth = getAuth();
  await auth.signOut();
};
