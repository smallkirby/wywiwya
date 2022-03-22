import { initializeApp } from 'firebase/app';

let isInitialized = false;

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
  initializeApp(config);
  isInitialized = true;
};

export default ({ $config }: {$config: any}) => {
  initApp($config);
};
