import { State } from '~/store/state';
import { Notification } from '~/typings/notification';

const getters = {
  me: (state: State) => {
    return state.user;
  },

  isLoggedIn: (state: State) => {
    return state.user !== null && state.user !== 'trying';
  },

  notifications: (state: State) => {
    return state.fetchedNotifications;
  },

  unreadNotifications: (state: State): Notification[] => {
    const user = state.user;
    if (state.fetchedNotifications === null || user === null || user === 'trying') {
      return [];
    }

    return state.fetchedNotifications.filter((cand) => {
      return user.readNotifications.findIndex((nid: string) => {
        return nid === cand.id;
      }) === -1;
    });
  },

  readNotifications: (state: State): string[] => {
    const user = state.user;
    if (user === null || user === 'trying') {
      return [];
    }
    return user.readNotifications;
  },
};

export default getters;
