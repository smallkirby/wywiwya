import moment, { Moment } from 'moment';
import { convert2moment } from './util/date';
import { Kusa } from '~/typings/kusa';

/*
 * Represents single day and describes whether a diary is written at that day.
 */
export type KusaEntry = {
  isWritten: boolean,
  date: Moment,
}

/*
 * Convert `Kusa[]` into `KusaEntry[][]`.
 */
export const getKusaEntries = (kusas: Kusa[]): KusaEntry[][] => {
  const kusaMoments = kusas.map((ent) => {
    return convert2moment(ent.date);
  }).filter((ent) => {
    return ent !== null;
  }) as Moment[];

  // TODO: for now, show only this year's.
  const now = moment();
  const targetKusaMoments = kusaMoments.filter((ent) => {
    return ent.year === now.year;
  });

  const kusaEnts: KusaEntry[][] = [];
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
    kusaEnts.push(weekKusas);
  }

  return kusaEnts;
};
