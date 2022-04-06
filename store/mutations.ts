import { LoginState, State } from '~/store/state';
import { Notification } from '~/typings/notification';

const mutations = {
  clearUser: (state: State) => {
    state.user = null;
  },

  commitUser: (state: State, user: LoginState) => {
    state.user = user;
  },

  commitUserName: (state: State, newName: string) => {
    if (state.user !== null && state.user !== 'trying') {
      state.user.displayName = newName;
    }
  },

  commitNotifications: (state: State, notifications: Notification[]) => {
    state.fetchedNotifications = notifications;
  },
};

export default mutations;
