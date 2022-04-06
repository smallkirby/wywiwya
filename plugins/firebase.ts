import { initializeApp } from 'firebase/app';
import { connectFunctionsEmulator, Functions, getFunctions } from 'firebase/functions';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';

let isInitialized = false;
let functions: Functions | null = null;
let firestore: Firestore | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;

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

export const getProjectAuth = () => {
  if (auth === null) {
    // eslint-disable-next-line no-console
    console.error('Auth is not initialized');
  };
  return auth as Auth;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  analytics = getAnalytics(app);

  isInitialized = true;
};

export default ({ $config }: {$config: any}) => {
  initApp($config);
};
