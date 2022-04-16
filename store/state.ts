import { DocumentReference, Timestamp } from 'firebase/firestore';
import { Kusa } from '~/typings/kusa';
import { Notification } from '~/typings/notification';

export type UID = string;

export type User = {
  displayName: string,
  photoURL: string,
  uid: UID,
  diaries: DocumentReference[],
  createdAt: Timestamp | null,
  kusa: Kusa[],
  readNotifications: string[],
}

export type LoginState = User | 'trying' | null;

export type State = {
  user: LoginState,
  fetchedNotifications: Notification[] | null,
}

const state: State = {
  user: null,
  fetchedNotifications: null,
};

export default () => state;
