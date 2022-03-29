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

      <div class="flex flex-col mx-2 mt-1">
        <div>
          <editor-toolbar
            ref="toolbar"
            :date-string="dateString"
            :is-temporary="diaryChanged.isTemporary"
            @requestSave="onRequestSave"
            @temporaryStateChanged="onTemporaryChange"
          />
        </div>

        <div class="flex">
          <div class="w-1/2">
            <editor-main-box ref="mainEditor" @mdCodeChange="onCodeChange" />
          </div>
          <div class="w-1/2 overflow-x-hidden">
            <editor-preview-box ref="previewBox" />
          </div>
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ConfirmDialog } from '../misc/Dialog.vue';
import { Diary } from '~/typings/diary';
import { getDiary, removeDiary, setDiary } from '~/lib/localstorage';
import { updsateDiary } from '~/lib/diary';

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
  },

  data () {
    return {
      diaryChanged: this.diary as Diary,
      failDialogConfig: FailDialogConfig,
      isUpdateFailShowing: false,
    };
  },

  computed: {
    dateString () {
      const parts = this.diary.dateID.split('-');
      return `${parts[0]}年${parts[1]}月${parts[2]}日`;
    },
  },

  mounted () {
    this.restoreUnsavedDiary();
    this.setText(this.diaryChanged.contentMd);
  },

  methods: {
    onCodeChange (mdCode: string) {
      (this.$refs.previewBox!! as any).compileWrite(mdCode);
      this.diaryChanged.contentMd = mdCode;
      this.saveDiaryLocal();
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

    saveDiaryLocal () {
      setDiary(this.diaryChanged);
    },

    setText (newText: string) {
      const mainEditor = this.$refs.mainEditor;
      if (mainEditor === undefined) {
        return;
      }
      (mainEditor as any).setText(newText);
    },

    async onRequestSave () {
      const result = await updsateDiary(this.diaryChanged);
      if (result !== null) {
        // eslint-disable-next-line no-console
        console.error(`Failed to update diary: ${result}`);
        this.isUpdateFailShowing = true;
      } else {
        removeDiary(this.diary.dateID);
      }

      (this.$refs.toolbar!! as any).onSaveComplete();
    },

    onFailDialogClosed () {
      this.isUpdateFailShowing = false;
    },

    onTemporaryChange (isTemporary: boolean) {
      this.diaryChanged.isTemporary = isTemporary;
    },
  },
});

</script>
