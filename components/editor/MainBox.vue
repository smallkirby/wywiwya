<template>
  <layout-wrapper>
    <div class="w-full">
      <textarea
        id="editor"
        ref="mdTextarea"
        class="w-full h-auto rounded-2xl border-t-2 border-b-2 border-skgray-dark"
      />
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { EditorConfiguration, Editor, fromTextArea, Position } from 'codemirror';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { uploadImage } from '~/lib/gyazo';
import { tabHandler } from '~/lib/editor';
import '~/static/css/wywiwya.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/keymap/vim.js';
import 'codemirror/addon/edit/continuelist.js';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/addon/edit/closebrackets.js';

export type EditorBinding = 'vim' | 'plain';

export default Vue.extend({
  name: 'MainBox',

  data () {
    return {
      editor: null as null | Editor,
      binding: 'vim' as EditorBinding,
    };
  },

  mounted () {
    const editor: HTMLTextAreaElement | null = document.querySelector('#editor');
    if (editor === null) {
      return;
    }
    const config: EditorConfiguration = {
      theme: 'wywiwya',
      lineNumbers: true,
      mode: 'markdown',
      showHint: true,
      indentUnit: 2,
      smartIndent: true,
      indentWithTabs: false,
      lineWrapping: true,
      styleActiveLine: true,
      keyMap: 'vim',
      autoCloseBrackets: true,
      foldGutter: true,
      gutters: [
        'CodeMirror-linenumbers',
        'CodeMirror-foldgutter',
      ],
      extraKeys: {
        Enter: 'newlineAndIndentContinueMarkdownList',
        Tab: tabHandler,
      },
    };
    this.editor = fromTextArea(editor, config);

    this.editor.on('change', _.throttle(() => {
      if (this.editor === null) { return; }
      this.$emit('mdCodeChange', this.editor.getDoc().getValue());
    }, 500));

    this.editor.on('drop', (editor, event) => {
      if (this.editor === null) { return; }
      this.handleImageDrop(editor, event);
    });

    this.editor.on('scroll', _.throttle(() => {
      if (this.editor === null) { return; }
      this.$emit('editorScrolled');
    }, 10));
  },

  methods: {
    setText (newMd: string) {
      if (this.editor === null) {
        return;
      }
      this.editor.getDoc().setValue(newMd);
    },

    changeBinding (newBinding: EditorBinding) {
      if (newBinding === 'vim') {
        this.editor?.setOption('keyMap', 'vim');
      } else if (newBinding === 'plain') {
        this.editor?.setOption('keyMap', 'default');
      }
    },

    handleImageDrop (editor: Editor, event: DragEvent) {
      if (!event.dataTransfer) { return; }
      const files = event.dataTransfer.files;
      if (!files) { return; }

      // move cursor
      editor.focus();
      const visualPosition = {
        x: event.pageX,
        y: event.pageY,
      };
      editor.setCursor(editor.coordsChar({
        left: visualPosition.x,
        top: visualPosition.y,
      }));

      const targetRange = {
        start: editor.getCursor('head'),
        end: editor.getCursor('end'),
      };

      // upload each files
      for (const file of Array.from(files)) {
        if (!file.type.match(/image.*/)) {
          continue;
        }

        // set temporary string
        const uuid = uuidv4();
        const tempStr = `[Uploading image as ${uuid}...] `;
        editor.replaceRange(tempStr, targetRange.start, targetRange.end);
        const currentEnd: Position = {
          ch: targetRange.end.ch + tempStr.length,
          line: targetRange.end.line,
        };

        // upload
        uploadImage(file, editor, { start: targetRange.start, end: currentEnd });
        targetRange.start = currentEnd;
      }
    },

    getEditorInstance (): Editor | null {
      return this.editor;
    },
  },
});
</script>

<style>
.CodeMirror {
  height: calc(100vh - 150px) !important;
  padding-left: 10px;
  padding-bottom: 30px;
}

.CodeMirror-dialog {
  margin-left: 30px;
  font-family: 'Ubuntu Mono'
}

.CodeMirror-dialog input {
  outline: none;
  background: transparent;
}

.cm-vim-message {
  font-family: 'Ubuntu Mono';
}

.CodeMirror-line {
  font-family: 'Ubuntu Mono' !important;
  font-size: 1.0rem !important;
}

.CodeMirror-foldgutter-open {
  color: #B16286;
}

.CodeMirror ::-webkit-scrollbar {
  width: 0.5em;
}
.CodeMirror ::-webkit-scrollbar-track {
  color: #130F1A;
  background: #130F1A;
}
.CodeMirror ::-webkit-scrollbar-thumb {
  background: #EBDBB2;
}

</style>
