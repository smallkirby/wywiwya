/*
 * This file defines date utility functions.
 */

import { Timestamp } from 'firebase/firestore';
import moment, { Moment } from 'moment';

/*
 * Convert unknown date-like object into Date
 */
export const convert2date = (timestamp: any): Date | null => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  } else if (timestamp instanceof Date) {
    // @ts-ignore
    return timestamp;
  } else if (typeof timestamp === 'number') {
    // @ts-ignore
    return new Date(timestamp);
  } else {
    return null;
  }
};

/*
 * Convert unknown date-like object into moment.
 */
export const convert2moment = (timestamp: any): Moment | null => {
  const dateNullable = convert2date(timestamp);
  return dateNullable !== null ? moment(dateNullable) : null;
};
