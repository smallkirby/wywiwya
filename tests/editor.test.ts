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
      5,
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

  test('Simple block parser check3', () => {
    const syncher = new Syncher(null as any, null as any);
    const mdCode = `# 0

    ## 1

    2

    3
    3


    4

    - 5
      - 6
    - 7`;

    const answer = [
      0,
      1,
      1,
      2,
      2,
      2,
      3,
      3,
      3,
      3,
      4,
      4,
      5,
      6,
    ];
    const blockMap = (syncher as any).buildBlockMapNotThrottled(mdCode);
    for (const ix of Array(answer.length).keys()) {
      expect(answer[ix]).toBe(blockMap[ix]);
    }
  });

  test('List parser check 1', () => {
    const syncher = new Syncher(null as any, null as any);
    const mdCode = `- 0

    - 1

    - 2
    - 3
    - 4

    5`;

    const answer = [
      0,
      0,
      1,
      1,
      2,
      3,
      4,
      4,
      5,
    ];
    const blockMap = (syncher as any).buildBlockMapNotThrottled(mdCode);
    for (const ix of Array(answer.length).keys()) {
      expect(answer[ix]).toBe(blockMap[ix]);
    }
  });

  test('List parser check 2', () => {
    const syncher = new Syncher(null as any, null as any);
    const mdCode = `- 0
    - 1
    - 2
      - 3
      - 4

      - 5
        - 6
    - 7

    8`;

    const answer = [
      0,
      1,
      2,
      3,
      4,
      4,
      5,
      6,
      7,
      7,
      8,
    ];
    const blockMap = (syncher as any).buildBlockMapNotThrottled(mdCode);
    for (const ix of Array(answer.length).keys()) {
      expect(answer[ix]).toBe(blockMap[ix]);
    }
  });

  test('List parser check 3', () => {
    const syncher = new Syncher(null as any, null as any);
    const mdCode = `- 0
    - 1
      - 2
    # 3
    4
    4`;

    const answer = [
      0,
      1,
      2,
      3,
      4,
      4,
    ];
    const blockMap = (syncher as any).buildBlockMapNotThrottled(mdCode);
    for (const ix of Array(answer.length).keys()) {
      expect(answer[ix]).toBe(blockMap[ix]);
    }
  });

  test('List parser check 4', () => {
    const syncher = new Syncher(null as any, null as any);
    const mdCode = `- 0
    - 1
      - 2

    # 3
    4
    4`;

    const answer = [
      0,
      1,
      2,
      2,
      3,
      4,
      4,
    ];
    const blockMap = (syncher as any).buildBlockMapNotThrottled(mdCode);
    for (const ix of Array(answer.length).keys()) {
      expect(answer[ix]).toBe(blockMap[ix]);
    }
  });
});
