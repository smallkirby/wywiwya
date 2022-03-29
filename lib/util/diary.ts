import { DID } from '~/typings/diary';

export const did2string = (did: DID): string => {
  const parts = did.split('-');
  if (parts.length !== 3) { return 'INVALID-DATE'; }
  return `${parts[0]}年${parts[1]}月${parts[2]}日`;
};
