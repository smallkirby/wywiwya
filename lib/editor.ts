import { Editor } from 'codemirror';
import _ from 'lodash';

type BlockIncrementFlag = 'imm' | 'lazy' | 'cont';

export const tabHandler = (editor: Editor) => {
  const doc = editor.getDoc();
  const cursor = doc.getCursor();

  if (doc.getLine(cursor.line).trimStart().startsWith('- ') && cursor.ch >= 2) {
    // make list deeper
    const insertionPoint = {
      ...cursor,
    };
    insertionPoint.ch = 0;
    doc.replaceRange(' '.repeat(2), insertionPoint);
  } else {
    // just insert spaces instead of tab
    doc.replaceRange(' '.repeat(2), cursor);
  }
};

export class Syncher {
  private editor: Editor;
  private preview: HTMLIFrameElement;
  private blockMap: Record<number, number> | null;
  private scrollMap: Record<number, number> | null;
  private isMapsDirty: boolean;
  private enabled: boolean;
  private nowCreatingBlockMap: boolean;
  private nowCreatingScrollMap: boolean;

  constructor (editor: Editor, iframe: HTMLIFrameElement) {
    this.editor = editor;
    this.preview = iframe;
    this.blockMap = null;
    this.scrollMap = null;
    this.isMapsDirty = true;
    this.enabled = true;
    this.nowCreatingBlockMap = false;
    this.nowCreatingScrollMap = false;
  }

  private buildBlockMapNotThrottled (mdCode: string): Record<number, number> {
    this.nowCreatingBlockMap = true;
    const tmpBlockMap: Record<number, number> = {};
    let currentLineNum = 0;
    let currentBlockNum = 0;
    let isPreviousLineEmpty = true;
    let blockIncFlag: BlockIncrementFlag = 'cont';

    for (const _line of mdCode.split('\n')) {
      const line = _line.trim();
      if (line.length !== 0 && blockIncFlag === 'lazy' && isPreviousLineEmpty) {
        ++currentBlockNum;
        blockIncFlag = 'cont';
      }
      tmpBlockMap[currentLineNum] = currentBlockNum;

      if (line.startsWith('#')) {
        // Unconditionally increment block
        blockIncFlag = 'imm';
        isPreviousLineEmpty = false;
      } else if (line.startsWith('- ')) {
        if (blockIncFlag === 'lazy') {
          tmpBlockMap[currentLineNum] = ++currentBlockNum;
        }
        blockIncFlag = 'lazy';
        isPreviousLineEmpty = false;
      } else if (line.length !== 0 && isPreviousLineEmpty) {
        blockIncFlag = 'lazy';
        isPreviousLineEmpty = false;
      } else if (line.length !== 0) {
        // @ts-ignore
        blockIncFlag = blockIncFlag === 'lazy' ? 'lazy' : 'cont';
        isPreviousLineEmpty = false;
      } else if (line.length === 0) {
        // @ts-ignore
        blockIncFlag = blockIncFlag === 'lazy' ? 'lazy' : 'cont';
        isPreviousLineEmpty = true;
      }

      if (blockIncFlag === 'imm') {
        ++currentBlockNum;
      }

      ++currentLineNum;
    }

    this.nowCreatingBlockMap = false;
    return tmpBlockMap;
  }

  private getRecursiveScrollMap (elm: Element, window: Window, currentMap: number[]): number[] {
    if (['ul'].includes(elm.tagName.toLowerCase())) {
      const lisCollection = elm.children;
      for (const ix of Array(lisCollection.length).keys()) {
        const li = lisCollection.item(ix);
        if (li !== null) {
          currentMap.push(li.getClientRects()[0].top);

          const liChildCollection = li.children;
          for (const jx of Array(liChildCollection.length)) {
            const liChild = liChildCollection.item(jx);
            if (liChild !== null) {
              currentMap = this.getRecursiveScrollMap(liChild, window, currentMap);
            }
          }
        }
      }
    } else {
      currentMap.push(elm.getClientRects()[0].top);
    }

    return currentMap;
  }

  private buildScrollMapNotThrottled (elms: HTMLCollection, window: Window): Record<number, number> {
    this.nowCreatingScrollMap = true;
    if (elms.length === 0) {
      this.nowCreatingScrollMap = false;
      return {
        0: 0,
      };
    }

    let tmpScrollMap: number[] = [];
    tmpScrollMap.push(0);

    for (const ix of Array(elms.length - 1).keys()) {
      const elm = elms.item(ix);
      if (elm === null) {
        tmpScrollMap.push(tmpScrollMap[tmpScrollMap.length - 1]);
      } else {
        tmpScrollMap = this.getRecursiveScrollMap(elm, window, tmpScrollMap);
      }
    }

    tmpScrollMap.splice(0, 1);
    this.nowCreatingScrollMap = false;
    return tmpScrollMap;
  }

  private buildMaps = _.throttle((mdContent, elms, window, callback) => {
    this.blockMap = this.buildBlockMapNotThrottled(mdContent);
    this.scrollMap = this.buildScrollMapNotThrottled(elms, window);
    this.isMapsDirty = false;
    callback();
  }, 100);

  private getPreviewElements (): HTMLCollection | null {
    if (!this.preview.contentDocument || this.preview.contentDocument.children.length === 0) {
      return null;
    } else {
      const children = this.preview.contentDocument.children;
      if (children[0].getElementsByTagName('body').length === 0) {
        return null;
      } else {
        return children[0].getElementsByTagName('body')[0].children;
      }
    }
  };

  // Get actual top line number.
  // Here, `line` means multiple sentence split by '\n'
  private getTopLineNum (): number {
    const topOffset = this.editor.heightAtLine(0);
    return this.editor.lineAtHeight(this.editor.getScrollInfo().top + topOffset);
  }

  // Currently, it only supports CommonMarkdown newline syntax. (single '\n' doesn't insert newline)
  syncToPreview (window: Window) {
    if (!this.enabled) {
      return;
    }
    if (this.nowCreatingBlockMap || this.nowCreatingScrollMap) {
      return;
    }

    const elements = this.getPreviewElements();
    if (elements === null) { return; }

    // Build mappings only for first time.
    // Rebuilding of mappings must be handled only by `rebuildMaps`
    if (this.blockMap === null || this.scrollMap === null) {
      this.buildMaps(this.editor.getValue(), elements, window, () => {
        this.syncToPreview(window);
      });
      return;
    }

    const currentLineNum = this.getTopLineNum();

    // Get corresponding preview element
    if (!this.blockMap || !this.scrollMap) {
      // eslint-disable-next-line no-console
      console.error('Failed to build block/scroll mapping...');
      return;
    }
    let currentElementIx = this.blockMap[currentLineNum];
    if (currentElementIx === undefined) {
      currentElementIx = elements.length - 1;
    }

    this.preview.contentWindow?.scrollTo(0, this.scrollMap[currentElementIx]);
  }

  markAsDirty () {
    this.isMapsDirty = true;
  }

  rebuildMaps () {
    if (!this.enabled || !this.isMapsDirty) {
      return;
    }
    if (this.nowCreatingBlockMap || this.nowCreatingScrollMap) {
      return;
    }

    const elements = this.getPreviewElements();
    if (elements === null) { return; }

    this.buildMaps(this.editor.getValue(), elements, window, () => {});
  }

  enable () {
    this.enabled = true;
  }

  disable () {
    this.enabled = false;
  }
}
