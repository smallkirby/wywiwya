import { UID } from '~/store/state';

export type DID = string;
export type DateID = string;

export type Diary = {
  dateID: DateID,
  createdAt: Date,
  lastUpdatedAt: Date,
  isPublic: boolean,
  isTemporary: boolean,
  contentMd: string,
  author: UID,
}
