<template>
  <layout-wrapper>
    <div class="px-4">
      <misc-dialog v-show="isUpdateFailShowing" :config="failDialogConfig" @failAlertOk="onFailDialogClosed">
        <div class="flex flex-col">
          <div>Diaryの更新に失敗しました。</div>
          <div>時間をおいて再試行してみてください。</div>
          <div>なお、保存結果はローカルにも保存されており、次回編集時に読み込まれます。</div>
        </div>
      </misc-dialog>

      <div class="flex flex-col md:mx-2 mt-1">
        <div>
          <editor-toolbar
            ref="toolbar"
            :date-string="dateString"
            :is-temporary="diaryChanged.isTemporary"
            :is-public="diaryChanged.isPublic"
            :mode="mode"
            :synched="true"
            @requestSave="onRequestSave"
            @temporaryStateChanged="onTemporaryChange"
            @publicStateChanged="onPublicChange"
            @requestBindingChange="onRequestBindingChange"
            @requestModeChange="(newMode) => $emit('requestModeChange', newMode)"
            @requestSyncChange="onSyncChanged"
          />
        </div>

        <div class="flex flex-col md:flex-row items-center justify-center">
          <div v-show="mode === 'edit'" class="w-full md:w-1/2 mt-2">
            <editor-main-box ref="mainEditor" @mdCodeChange="onCodeChange" @editorScrolled="onEditorScrolled" />
          </div>
          <div
            class="w-full md:w-1/2 overflow-x-hidden md:block"
            :class="{
              'hidden': mode === 'edit',
              'pr-2': mode === 'view',
            }"
          >
            <editor-preview-box
              ref="previewBox"
              :adjust-height="mode === 'view'"
              :side-border="mode === 'view'"
            />
          </div>
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import _ from 'lodash';
import { Editor } from 'codemirror';
import { ConfirmDialog } from '../misc/Dialog.vue';
import { EditorBinding } from './MainBox.vue';
import { Diary } from '~/typings/diary';
import { getDiary, removeDiary, setDiary } from '~/lib/localstorage';
import { updateDiary } from '~/lib/diary';
import { Syncher } from '~/lib/editor';

const FailDialogConfig: ConfirmDialog = {
  typ: 'confirm',
  title: 'Diaryの更新に失敗しました',
  closeText: 'OK',
  closeEmission: 'failAlertOk',
};

export default Vue.extend({
  name: 'Integrated',

  props: {
    // eslint-disable-next-line vue/prop-name-casing
    diary: {
      type: Object as PropType<Diary>,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      diaryChanged: this.diary as Diary,
      latestString: this.diary.contentMd,
      failDialogConfig: FailDialogConfig,
      isUpdateFailShowing: false,
      syncher: null as Syncher | null,
    };
  },

  computed: {
    dateString () {
      const parts = this.diary.dateID.split('-');
      return `${parts[0]}年${parts[1]}月${parts[2]}日`;
    },
  },

  watch: {
    mode () {
      const previewBox = this.$refs.previewBox;
      if (!previewBox) { return; }
      if (this.mode === 'view') {
        (previewBox as any).doAdjustHeight();
      } else {
        (previewBox as any).doShrinkHeight();
      }
    },
  },

  mounted () {
    const handler = setInterval(() => {
      if (this.$refs.previewBox && this.$refs.mainEditor) {
        // Restore and compile a diary in local storage
        this.restoreUnsavedDiary();
        (this.$refs.previewBox!! as any).compileWrite(this.diaryChanged.contentMd);
        this.setText(this.diaryChanged.contentMd);

        // Instantiate syncher
        this.syncher = new Syncher(
          (this.$refs.mainEditor as any).getEditorInstance(),
          (this.$refs.previewBox as any).getIframe(),
        );

        clearInterval(handler);
      }
    }, 500);
  },

  methods: {
    onCodeChange (mdCode: string) {
      const previewBox = this.$refs.previewBox;
      if (!previewBox) { return; }
      (previewBox as any).compileWrite(mdCode);
      this.diaryChanged.contentMd = mdCode;
      this.saveDiaryLocal(this.diaryChanged);

      if (this.latestString !== mdCode && this.$refs.toolbar !== undefined) {
        // @ts-ignore
        this.$refs.toolbar.setDirty();
      }
      if (this.syncher) {
        this.syncher.markAsDirty();
      }
    },

    restoreUnsavedDiary () {
      const diaryLocal = getDiary(this.diary.dateID);
      // diary not saved in local
      if (diaryLocal === null) {
        return;
      }
      // diary in local is old than in server
      if (diaryLocal.savedAt.getTime() < this.diary.lastUpdatedAt.getTime()) {
        return;
      }

      const diary = diaryLocal.diary;
      this.diaryChanged.contentMd = diary.contentMd;
      this.diaryChanged.isPublic = diary.isPublic;
      this.diaryChanged.isTemporary = diary.isTemporary;
    },

    // save on local storage has no need to be done frequently.
    saveDiaryLocal: _.throttle((diaryToSave: Diary) => {
      setDiary(diaryToSave);
    }, 1000 * 10),

    setText (newText: string) {
      // dirty workaround
      const interval = setInterval(() => {
        if (this.$refs.mainEditor) {
          const mainEditor = this.$refs.mainEditor;
          if (mainEditor === undefined) {
            return;
          }
          (mainEditor as any).setText(newText);

          if (this.latestString !== newText && this.$refs.toolbar !== undefined) {
            // @ts-ignore
            this.$refs.toolbar.setDirty();
          }

          clearInterval(interval);
        }
      }, 100);
    },

    async onRequestSave () {
      const result = await updateDiary(this.diaryChanged);
      if (result !== null) {
        // eslint-disable-next-line no-console
        console.error(`Failed to update diary: ${result}`);
        this.isUpdateFailShowing = true;
      } else {
        const toolbar = this.$refs.toolbar;
        removeDiary(this.diary.dateID);
        this.latestString = this.diaryChanged.contentMd;
        if (toolbar !== undefined) {
          // @ts-ignore
          toolbar.unsetDirty();
        }
      }

      (this.$refs.toolbar!! as any).onSaveComplete();
    },

    onFailDialogClosed () {
      this.isUpdateFailShowing = false;
    },

    onTemporaryChange (isTemporary: boolean) {
      this.diaryChanged.isTemporary = isTemporary;
    },

    onPublicChange (isPublic: boolean) {
      this.diaryChanged.isPublic = isPublic;
    },

    onRequestBindingChange (newBinding: EditorBinding) {
      const mainEditor = this.$refs.mainEditor;
      if (mainEditor) {
        // @ts-ignore
        mainEditor.changeBinding(newBinding);
      }
    },

    getEditorInstance (): Editor | null {
      const mainEditor = this.$refs.mainEditor;
      if (mainEditor) {
        // @ts-ignore
        return mainEditor.getEditorInstance();
      } else {
        return null;
      }
    },

    getIframeInstance (): HTMLIFrameElement | null {
      const previewBox = this.$refs.previewBox;
      if (previewBox) {
        // @ts-ignore
        return previewBox.getIframe();
      } else {
        return null;
      }
    },

    onEditorScrolled () {
      if (this.syncher !== null) {
        this.syncher.syncToPreview(window);
      }
    },

    onSyncChanged (value: boolean) {
      if (value) {
        this.syncher?.enable();
      } else {
        this.syncher?.disable();
      }
    },
  },
});

</script>
