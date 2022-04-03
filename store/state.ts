import { DocumentReference, Timestamp } from 'firebase/firestore';

export type UID = string;

export type User = {
  displayName: string,
  photoURL: string,
  uid: UID,
  diaries: DocumentReference[],
  createdAt: Timestamp | null,
}

export type LoginState = User | 'trying' | null;

export type State = {
  user: LoginState,
}

const state: State = {
  user: null,
};

export default () => state;
