import * as functions from 'firebase-functions';

export const isAuthed = (authinfo: functions.https.CallableContext['auth']) => {
  if (authinfo === undefined) {
    return false;
  } else {
    return true;
  }
};
