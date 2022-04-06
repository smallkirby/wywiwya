import { DocumentReference, Timestamp } from 'firebase/firestore';
import { Kusa } from '~/lib/kusa';

export type UID = string;

export type User = {
  displayName: string,
  photoURL: string,
  uid: UID,
  diaries: DocumentReference[],
  createdAt: Timestamp | null,
  kusa: Kusa,
}

export type LoginState = User | 'trying' | null;

export type State = {
  user: LoginState,
}

const state: State = {
  user: null,
};

export default () => state;
