import { GithubAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

const provider = new GithubAuthProvider();

export const Login = async () => {
  const auth = getAuth();
  const result = await signInWithPopup(auth, provider);
  const credential = GithubAuthProvider.credentialFromResult(result);
  // eslint-disable-next-line no-console
  console.log(credential);
};
