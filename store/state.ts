export type UID = string;

export type User = {
  displayName: string,
  photoURL: string,
  uid: UID,
  numDiaries: number | null,
}

export type State = {
  user: User | null,
}

const state: State = {
  user: null,
};

export default () => state;
