<template>
  <layout-wrapper>
    <div v-show="isLoading" class="mt-20">
      <vue-loading />
    </div>

    <misc-dialog
      v-show="dialogShowing"
      :config="failDialogConfig"
      @failAlertOk="onFailDialogClosed"
    >
      <div class="flex flex-col">
        <div>
          新規Dialogの作成に失敗しました。
        </div>
        <div>
          少し時間をおいて、画面をリロードしてから再試行してください。
        </div>
      </div>
    </misc-dialog>

    <layout-main-box v-show="!isLoading">
      <div class="flex flex-col p-4">
        <div class="border-b-2 my-2">
          <write-todays-write class="mb-6" @requestNewWrite="createNewDiary" />
        </div>

        <div class="border-b-2 pb-6">
          <write-temp-write class="mt-6" />
        </div>

        <div class="border-b-2 my-2 pb-6">
          <write-old-edit class="mt-6" />
        </div>
      </div>
    </layout-main-box>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { ConfirmDialog } from '~/components/misc/Dialog.vue';
import { createNewDiary } from '~/lib/diary';

const FailDialogConfig: ConfirmDialog = {
  typ: 'confirm',
  title: 'Diaryの作成に失敗しました',
  closeText: 'OK',
  closeEmission: 'failAlertOk',
};

export default Vue.extend({
  name: 'WritePage',

  data () {
    return {
      isLoading: false,
      failDialogConfig: FailDialogConfig,
      dialogShowing: false,
    };
  },

  methods: {
    async createNewDiary () {
      this.isLoading = true;

      const did = await createNewDiary();
      if (did === null) {
        this.dialogShowing = true;
      } else {
        this.$router.push(`edit/${did}`);
      }

      this.isLoading = false;
    },

    onFailDialogClosed () {
      this.dialogShowing = false;
    },
  },
});

</script>
