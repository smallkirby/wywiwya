import { FieldValue } from 'firebase/firestore';
import moment from 'moment';

export const date2string = (date: Date): string => {
  return moment(date).format('YYYY年MM月DD日 HH:mm');
};

export const serverTimestamp2string = (timestamp: FieldValue) => {
  return (timestamp as any).toDate();
};
