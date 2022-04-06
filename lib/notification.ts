import { createClient } from 'microcms-js-sdk';
import moment from 'moment';
import { Notification } from '~/typings/notification';

const conevrtNotification = (notification: Notification): Notification => {
  if (typeof notification.createdAt === 'string') {
    notification.createdAt = moment(notification.createdAt).toDate();
  }
  if (typeof notification.updatedAt === 'string') {
    notification.updatedAt = moment(notification.updatedAt).toDate();
  }
  return notification;
};

export const getNotifications = async (apiKey: string): Promise<Notification[]> => {
  const client = createClient({
    serviceDomain: 'wywiwya',
    apiKey,
  });

  const result = await client.getList({
    endpoint: 'notifications',
  });

  const contents: Notification[] = result.contents;
  return contents.map((notif) => {
    return conevrtNotification(notif);
  });
};
