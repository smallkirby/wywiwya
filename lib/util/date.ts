import { Timestamp } from 'firebase/firestore';
import moment, { Moment } from 'moment';

export const date2string = (date: Date): string => {
  return moment(date).format('YYYY年MM月DD日 HH:mm');
};

export const serverTimestamp2string = (timestamp: Timestamp): string => {
  return serverTimestamp2moment(timestamp).format('YYYY年MM月DD日');
};

export const serverTimestamp2moment = (timestamp: Timestamp): Moment => {
  if (typeof timestamp.toDate === 'function') {
    const date = timestamp.toDate();
    return moment(date);
  } else if (typeof (timestamp as any).getTime === 'function') {
    // @ts-ignore
    return moment(timestamp.getTime());
  } else {
    return moment(timestamp);
  }
};
