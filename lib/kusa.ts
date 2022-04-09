import { Timestamp } from 'firebase/firestore';
import moment, { Moment } from 'moment';
import { serverTimestamp2moment } from './util/date';
import { Kusa } from '~/typings/kusa';

export type KusaEntry = {
  isWritten: boolean,
  date: Moment,
}

export const getKusaEntries = (kusa: Kusa): KusaEntry[][] => {
  const kusaMoments = kusa.map((ent) => {
    return serverTimestamp2moment(ent.date as any as Timestamp);
  });

  // TODO: for now, show only this year's.
  const now = moment();
  const targetKusaMoments = kusaMoments.filter((ent) => {
    return ent.year === now.year;
  });

  const kusas: KusaEntry[][] = [];
  const newyearday = moment().set('month', 0).set('date', 1);
  let offset = -1 * newyearday.weekday();
  while (true) {
    const weekKusas: KusaEntry[] = [];
    if (offset >= 366) {
      break;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of Array(7).keys()) {
      const theday = newyearday.clone().add('day', offset);
      weekKusas.push({
        isWritten: targetKusaMoments.findIndex((ent) => {
          return ent.year() === theday.year() &&
            ent.month() === theday.month() &&
            ent.date() === theday.date();
        }) !== -1,
        date: theday,
      });
      ++offset;
    }
    kusas.push(weekKusas);
  }

  return kusas;
};
