import { initializeApp } from 'firebase/app';
import { connectFunctionsEmulator, Functions, getFunctions } from 'firebase/functions';
import { getFirestore, doc, getDoc, connectFirestoreEmulator, setDoc, updateDoc, Firestore } from 'firebase/firestore';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { UID, User } from '~/store/state';

let isInitialized = false;
let functions: Functions | null = null;
let firestore: Firestore | null = null;
let auth : Auth | null = null;

export const getProjectFirestore = () => {
  if (firestore === null) {
    // eslint-disable-next-line no-console
    console.error('Firestore is not initialized');
  };
  return firestore as Firestore;
};

export const getProjectFunctions = () => {
  if (functions === null) {
    // eslint-disable-next-line no-console
    console.error('Functions is not initialized');
  };
  return functions as Functions;
};

export const isAppInitialized = () => {
  return isInitialized;
};

export const initApp = (vueConfig: any) => {
  if (isInitialized) {
    return;
  }
  const config = {
    apiKey: vueConfig.FB_APIKEY,
    authDomain: vueConfig.FB_AUTHDOMAIN,
    projectId: vueConfig.FB_PROJECTID,
    storageBucket: vueConfig.FB_STORAGEBUCKET,
    messagingId: vueConfig.FB_MESSAGINGSENDERID,
    appId: vueConfig.FB_APPID,
    mesurementId: vueConfig.FB_MEASUREMENTID,
  };
  const app = initializeApp(config);

  functions = getFunctions(app, 'asia-northeast1');
  firestore = getFirestore(app);
  auth = getAuth(app);
  if (vueConfig.FB_FIRESTORE_EMULATE === 1) {
    // eslint-disable-next-line no-console
    console.log('Using emulator for firestore.');
    connectFirestoreEmulator(firestore, 'localhost', 8081);
  }
  if (vueConfig.FB_FUNCTIONS_EMULATE === 1) {
    // eslint-disable-next-line no-console
    console.log('Using emulator for functions.');
    connectFunctionsEmulator(functions, 'localhost', 5001);
  }
  if (vueConfig.FB_AUTH_EMULATE === 1) {
    // eslint-disable-next-line no-console
    console.log('Using emulator for auth.');
    connectAuthEmulator(auth, 'http://localhost:9099');
  }

  isInitialized = true;
};

export const getNumDiaries = async (user: User): Promise<number | null> => {
  const db = getFirestore();
  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return userDocSnap.data().numDiaries;
  } else {
    return null;
  }
};

export const getUser = async (uid: UID): Promise<User | null> => {
  const db = getFirestore();
  const userDocRef = doc(db, 'users', uid);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    return userDocSnap.data() as User;
  } else {
    return null;
  }
};

export const setUser = async (user: User): Promise<boolean> => {
  const db = getFirestore();
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
      numDiaries: 0,
    }).then(() => {
      return true;
    }).catch((reason: any) => {
      // eslint-disable-next-line no-console
      console.error(reason);
      return false;
    });
  }
};

export default ({ $config }: {$config: any}) => {
  initApp($config);
};
