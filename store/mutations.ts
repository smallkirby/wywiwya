import { LoginState, State } from '~/store/state';
import { Notification } from '~/typings/notification';

const mutations = {
  clearUser: (state: State) => {
    state.user = null;
    state.fetchedNotifications = null;
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

  commitMarkReadNotification: (state: State, nid: string) => {
    if (state.user !== null && state.user !== 'trying') {
      if (!state.user.readNotifications.includes(nid)) {
        state.user.readNotifications.push(nid);
      }
    }
  },
};

export default mutations;
