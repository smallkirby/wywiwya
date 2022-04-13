import { Timestamp } from 'firebase/firestore';
import moment, { Moment } from 'moment';

export const serverTimestamp2string = (timestamp: Timestamp): string => {
  return serverTimestamp2moment(timestamp).format('YYYY年MM月DD日');
};

export const serverTimestamp2moment = (timestamp: any): Moment => {
  if (timestamp instanceof Timestamp) {
    const date = timestamp.toDate();
    return moment(date);
  } else if (timestamp instanceof Date) {
    // @ts-ignore
    return moment(timestamp.getTime());
  } else if (typeof timestamp === 'number') {
    // @ts-ignore
    return moment(new Date(timestamp));
  } else {
    return moment(timestamp);
  }
};
