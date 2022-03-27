import admin from 'firebase-admin';

process.env.TZ = 'Asia/Tokyo';

admin.initializeApp();

export { createNewDiary } from './diary';
