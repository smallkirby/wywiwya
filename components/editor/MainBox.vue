<template>
  <layout-wrapper>
    <div>
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
import { EditorConfiguration, Editor, fromTextArea } from 'codemirror';
import '~/static/css/wywiwya.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/keymap/vim.js';

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
      keyMap: 'vim',
    };
    this.editor = fromTextArea(editor, config);

    this.editor.on('change', () => {
      if (this.editor === null) { return; }
      this.$emit('mdCodeChange', this.editor.getDoc().getValue());
    });
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
