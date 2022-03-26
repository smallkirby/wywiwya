<template>
  <layout-wrapper>
    <div>
      <textarea id="editor" class="w-full h-auto" />
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { EditorConfiguration, Editor, fromTextArea } from 'codemirror';
import 'codemirror/theme/gruvbox-dark.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/keymap/vim.js';

export default Vue.extend({
  name: 'VimEditor',

  data () {
    return {
      editor: null as null | Editor,
    };
  },

  mounted () {
    const editor: HTMLTextAreaElement | null = document.querySelector('#editor');
    if (editor === null) {
      return;
    }
    const config: EditorConfiguration = {
      theme: 'darcula',
      lineNumbers: true,
      mode: 'markdown',
      showHint: true,
      indentUnit: 2,
      smartIndent: true,
      indentWithTabs: false,
      keyMap: 'vim',
    };
    this.editor = fromTextArea(editor, config);
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

</style>
