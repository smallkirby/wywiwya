import admin from 'firebase-admin';
import * as functions from 'firebase-functions';

process.env.TZ = 'Asia/Tokyo';

admin.initializeApp(functions.config().firebase);

export { createNewDiary, fetchPublicDiaries } from './diary';
export { changeUserName, searchUserFullMatch } from './user';
export { uploadImage } from './gyazo';
