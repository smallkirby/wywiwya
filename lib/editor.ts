import { Editor } from 'codemirror';
import _ from 'lodash';

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

    for (const _line of mdCode.split('\n')) {
      tmpBlockMap[currentLineNum] = currentBlockNum;
      const line = _line.trim();

      if (line.startsWith('#') || line.startsWith('- ')) {
        // Unconditionally increment block
        ++currentBlockNum;
        isPreviousLineEmpty = false;
      } else if (line.length !== 0 && isPreviousLineEmpty) {
        ++currentBlockNum;
        isPreviousLineEmpty = false;
      } else if (line.length !== 0) {
        isPreviousLineEmpty = false;
      } else {
        isPreviousLineEmpty = true;
      }

      ++currentLineNum;
    }

    return tmpBlockMap;
  }

  private buildScrollMapNotThrottled (elms: HTMLCollection, window: Window): Record<number, number> {
    const tmpScrollMap: Record<number, number> = {};
    tmpScrollMap[0] = 0;
    if (elms.length === 0) {
      return tmpScrollMap;
    }
    for (const ix of Array(elms.length - 1).keys()) {
      const elm = elms.item(ix);
      if (elm === null) {
        tmpScrollMap[ix + 1] = tmpScrollMap[ix];
      } else {
        const marginBottom = window.getComputedStyle(elm).marginBottom.split('px')[0];
        tmpScrollMap[ix + 1] = tmpScrollMap[ix] + elm.clientHeight + Number(marginBottom);
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

  // Currently, it only supports CommonMarkdown newline syntax. (single '\n' doesn't insert newline)
  syncToPreview (window: Window) {
    if (!this.enabled) {
      return;
    }

    const scrollInfo = this.editor.getScrollInfo();
    const defaultHeight = (scrollInfo.height - 50) / this.editor.lineCount(); // 50px is padding-bottom
    const currentLineNum = Math.round(scrollInfo.top / defaultHeight);
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
