import yaml from 'js-yaml';
import { Diary } from '~/typings/diary';

/**  Diary  **/

export type DiaryLocal = {
  diary: Diary,
  savedAt: Date,
};

const getDiaryKey = (did: string) => {
  return `diaries/${did}`;
};

export const setDiary = (diary: Diary) => {
  const diaryLocal: DiaryLocal = {
    diary,
    savedAt: new Date(),
  };
  localStorage.setItem(getDiaryKey(diary.dateID), yaml.dump(diaryLocal));
};

export const getDiary = (dateID: string): DiaryLocal | null => {
  const value = localStorage.getItem(getDiaryKey(dateID));
  if (value === null || value.length === 0) {
    return null;
  }
  const restoredValue = yaml.load(value);
  if (restoredValue === undefined || restoredValue === undefined) {
    return null;
  }
  return restoredValue as DiaryLocal;
};

export const removeDiary = (dateID: string) => {
  localStorage.removeItem(getDiaryKey(dateID));
};
