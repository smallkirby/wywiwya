import { Store } from 'vuex';
import { getNotifications } from '~/lib/notification';
import { State } from '~/store/state';

export default async ({ store, $config }: { store: Store<State>, $config: any }) => {
  if (store.getters.notifications === null) {
    if (!$config.MICROCMS_API_KEY) {
      // eslint-disable-next-line no-console
      console.error('Couldn\'t find MICROCMS_API_KEY in conrfig.');
      return;
    }
    const notifications = await getNotifications($config.MICROCMS_API_KEY);
    store.commit('commitNotifications', notifications);
  }
};
