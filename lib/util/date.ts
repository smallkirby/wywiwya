import { Timestamp } from 'firebase/firestore';
import moment from 'moment';

export const date2string = (date: Date): string => {
  return moment(date).format('YYYY年MM月DD日 HH:mm');
};

export const serverTimestamp2string = (timestamp: Timestamp): string => {
  if (typeof timestamp.toDate === 'function') {
    const date = timestamp.toDate();
    return moment(date).format('YYYY年MM月DD日');
  } else if (typeof (timestamp as any).getTime === 'function') {
    // @ts-ignore
    return moment(timestamp.getTime()).format('YYYY年MM月DD日');
  } else {
    return moment(timestamp).format('YYYY年MM月DD日');
  }
};
