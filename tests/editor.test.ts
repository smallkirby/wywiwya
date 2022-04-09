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

    \`waiwai\`
    hogehoge
    fugafuga`;

    const answer = [
      0,
      1,
      1,
      1,
      2,
      3,
      3,
      3,
      4,
      5,
      6,
      6,
      6,
      7,
      7,
      8,
      9,
      9,
      9,
      9,
    ];
    const blockMap = (syncher as any).buildBlockMapNotThrottled(mdCode);
    for (const ix of Array(answer.length).keys()) {
      expect(answer[ix]).toBe(blockMap[ix]);
    }
  });

  test('Simple block parser check2', () => {
    const syncher = new Syncher(null as any, null as any);
    const mdCode = `# kirby

    ## ほげほげ

    ふがふが

    ほげほげほげ
    ふがふがふが`;

    const answer = [
      0,
      1,
      1,
      2,
      2,
      2,
      3,
      3,
    ];
    const blockMap = (syncher as any).buildBlockMapNotThrottled(mdCode);
    for (const ix of Array(answer.length).keys()) {
      expect(answer[ix]).toBe(blockMap[ix]);
    }
  });
});
