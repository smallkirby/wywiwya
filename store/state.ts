export type User = {
  displayName: string,
  photoURL: string,
  uid: string,
  numDiaries: number | null,
}

export type State = {
  user: User | null,
}

const state: State = {
  user: null,
};

export default () => state;
