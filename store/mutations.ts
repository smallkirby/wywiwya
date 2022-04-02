import { User as FirebaseUser } from 'firebase/auth';
import { DocumentReference } from 'firebase/firestore';
import { State } from '~/store/state';

const mutations = {
  setUser: (state: State, { user }:{ user: FirebaseUser }) => {
    state.user = {
      uid: user.uid,
      displayName: user.displayName!!,
      photoURL: user.photoURL!!,
      diaries: [],
    };
  },

  clearUser: (state: State) => {
    state.user = null;
  },

  setUserDiaries: (state: State, diaries: DocumentReference[]) => {
    if (state.user !== null) {
      state.user.diaries = diaries;
    }
  },
};

export default mutations;
