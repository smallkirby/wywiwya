import * as functions from 'firebase-functions';
import algoliasearch from 'algoliasearch';
import { User, UID, fetchUsers } from '../user';

const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID!!, process.env.ALGOLIA_SEARCH_KEY!!);
const algoliaIndex = algoliaClient.initIndex('firestore_users');

type UserSearchErr = 'invalid-query' | 'rate-limit' | null;

type UserSearchRet = {
  err: UserSearchErr,
  users: User[],
}

export const searchUserPartial =
  functions.region('asia-northeast1').https.onCall(async (data): Promise<UserSearchRet> => {
    // NOTE: allow unauthenticated users
    // TODO: DO RATE LIMIT

    if (typeof data.searchStr !== 'string') {
      return {
        err: 'invalid-query',
        users: [],
      };
    }

    // Query to Algolia
    const algoliaResult = await algoliaIndex.search(data.searchStr);
    const resultUids: UID[] = algoliaResult.hits.map((hit: any) => {
      return hit.uid;
    });

    // Query again to Firestore based on the result from Algolia
    const users = await fetchUsers(resultUids);

    return {
      err: null,
      users,
    };
  });
