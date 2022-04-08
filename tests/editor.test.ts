import { describe, test, expect } from '@jest/globals';
import { Syncher } from '../lib/editor';

describe('Test of block counts', () => {
  test('Simple block parser check', () => {
    const syncher = new Syncher(null as any, null as any);
    const mdCode = `# kirby

    test

    ## subtitle1

    sentence

    - list1
    - list2

    **strong** style.

    ![](https://i.gyazo.com/hogehoge.png)

    ## subtitle2

    \`waiwai\``;

    const answer = [
      0,
      1,
      1,
      2,
      2,
      3,
      3,
      4,
      5,
      6,
      6,
      7,
      7,
      8,
      8,
      9,
      9,
    ];
    const blockMap = (syncher as any).buildBlockMap(mdCode);
    for (const ix of Array(answer.length)) {
      expect(answer[ix] === blockMap[ix]);
    }
  });
});
