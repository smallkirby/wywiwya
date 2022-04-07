import * as functions from 'firebase-functions';

type UserRatelimitStatus = {
  ip: string,
  currentAcceeNum: Record<string, number>, // service key / call nums
};

const userRatelimitMap: UserRatelimitStatus[] = [];

const doClearRatelimit = () => {
  userRatelimitMap.splice(0, userRatelimitMap.length);
};

export const tryConsumeRatelimit = (ip: string, key: string, limitPerDay: number): boolean => {
  let targetIndex = userRatelimitMap.findIndex((cand) => {
    return cand.ip === ip;
  });
  if (targetIndex === -1) {
    userRatelimitMap.push({
      ip,
      currentAcceeNum: {},
    });
    targetIndex = userRatelimitMap.length - 1;
  }

  if (userRatelimitMap[targetIndex].currentAcceeNum[key] === undefined) {
    userRatelimitMap[targetIndex].currentAcceeNum[key] = 1;
    return true;
  } else {
    const currentNum = userRatelimitMap[targetIndex].currentAcceeNum[key];
    if (currentNum < limitPerDay) {
      userRatelimitMap[targetIndex].currentAcceeNum[key] = currentNum + 1;
      return true;
    } else {
      return false;
    }
  }
};

const clearAllRatelimit =
  functions.region('asia-northeast1').pubsub.schedule('0 0 * * *').timeZone('Asia/Tokyo').onRun(() => {
    // if (context.eventType !== 'pubsub') {
    //   // eslint-disable-next-line no-console
    //   console.error('Called from non-pubsub. Aborting...', context.eventType);
    //   return null;
    // }

    doClearRatelimit();
    // eslint-disable-next-line no-console
    console.log('Cleared all ratelimits.');
    return null;
  });

export { clearAllRatelimit };
