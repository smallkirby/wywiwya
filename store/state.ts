import { DocumentReference } from 'firebase/firestore';

export type UID = string;

export type User = {
  displayName: string,
  photoURL: string,
  uid: UID,
  diaries: DocumentReference[],
}

export type State = {
  user: User | null,
}

const state: State = {
  user: null,
};

export default () => state;
