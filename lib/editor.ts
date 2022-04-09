import { Editor } from 'codemirror';
import _ from 'lodash';

type BlockIncrementFlag = 'imm' | 'lazy' | 'cont';

export class Syncher {
  private editor: Editor;
  private preview: HTMLIFrameElement;
  private blockMap: Record<number, number> | null;
  private scrollMap: Record<number, number> | null;
  private isEditorDirty: boolean;
  private enabled: boolean;

  constructor (editor: Editor, iframe: HTMLIFrameElement) {
    this.editor = editor;
    this.preview = iframe;
    this.blockMap = null;
    this.scrollMap = null;
    this.isEditorDirty = true;
    this.enabled = true;
  }

  private buildBlockMapNotThrottled (mdCode: string): Record<number, number> {
    const tmpBlockMap: Record<number, number> = {};
    let currentLineNum = 0;
    let currentBlockNum = 0;
    let isPreviousLineEmpty = false;
    let blockIncFlag: BlockIncrementFlag = 'cont';

    for (const _line of mdCode.split('\n')) {
      const line = _line.trim();
      if (line.length !== 0 && blockIncFlag === 'lazy' && isPreviousLineEmpty) {
        ++currentBlockNum;
        blockIncFlag = 'cont';
      }
      tmpBlockMap[currentLineNum] = currentBlockNum;

      if (line.startsWith('#') || line.startsWith('- ')) {
        // Unconditionally increment block
        blockIncFlag = 'imm';
        isPreviousLineEmpty = false;
      } else if (line.length !== 0 && isPreviousLineEmpty) {
        blockIncFlag = 'lazy';
        isPreviousLineEmpty = false;
      } else if (line.length !== 0) {
        blockIncFlag = 'cont';
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

    return tmpBlockMap;
  }

  private getRecursiveScrollMap (elm: Element, window: Window, currentMap: number[]): number[] {
    if (elm.tagName.toLowerCase() === 'ul') {
      const children = elm.children;
      for (const ix of Array(children.length).keys()) {
        const child = children.item(ix);
        if (child !== null) {
          currentMap = this.getRecursiveScrollMap(child, window, currentMap);
        }
      }
    } else {
      const marginBottom = window.getComputedStyle(elm).marginBottom.split('px')[0];
      currentMap.push(currentMap[currentMap.length - 1] + elm.clientHeight + Number(marginBottom));
    }

    return currentMap;
  }

  private buildScrollMapNotThrottled (elms: HTMLCollection, window: Window): Record<number, number> {
    if (elms.length === 0) {
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

    return tmpScrollMap;
  }

  private buildBlockMap = _.throttle((mdContent, callback) => {
    this.blockMap = this.buildBlockMapNotThrottled(mdContent);
    callback();
  }, 100);

  private buildScrollMap = _.throttle((elms, window, callback) => {
    this.scrollMap = this.buildScrollMapNotThrottled(elms, window);
    callback();
  }, 100);

  private getPreviewElements (): HTMLCollection {
    return this.preview.contentDocument!!.children[0].getElementsByTagName('body')[0].children;
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

    const elements = this.getPreviewElements();

    // Build mapping if editor is marked as dirty
    if (this.blockMap === null || this.isEditorDirty) {
      this.buildBlockMap(this.editor.getValue(), () => {
        this.syncToPreview(window);
      });
    }
    if (this.scrollMap === null || this.isEditorDirty) {
      this.buildScrollMap(elements, window, () => {
        this.syncToPreview(window);
      });
    }
    this.isEditorDirty = false;

    const currentLineNum = this.getTopLineNum();

    // Get corresponding preview element
    if (!this.blockMap || !this.scrollMap) {
      return;
    }
    let currentElementIx = this.blockMap[currentLineNum];
    if (currentElementIx === undefined) {
      currentElementIx = elements.length - 1;
    }

    this.preview.contentWindow?.scrollTo(0, this.scrollMap[currentElementIx]);
  }

  markAsDirty () {
    this.isEditorDirty = true;
  }

  enable () {
    this.enabled = true;
  }

  disable () {
    this.enabled = false;
  }
}
