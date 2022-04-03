<template>
  <layout-wrapper>
    <div class="flex flex-col">
      <misc-dialog
        v-show="dialogShowing"
        :config="dialogConfig"
        @dialogAlertOk="dialogShowing = false"
      >
        <p>{{ dialogSentence }}</p>
      </misc-dialog>

      <div class="text-3xl font-bold pb-2 mb-4 border-b-2 border-skdark">
        <font-awesome-icon icon="fa-solid fa-wrench" />
        設定
      </div>

      <div class="flex flex-col ml-4 mt-2">
        <!-- Change Display Name -->
        <div>
          <div>
            <div class="text-xl pb-1 mb-4 border-b-2 border-skgray-dark w-max pr-8">
              表示名を変更する
            </div>
          </div>
          <div class="ml-4 mt-1 items-center flex">
            <p class="mr-8">
              現在の名前:
            </p>
            <p class="italic">
              {{ me.displayName }}
            </p>
          </div>
          <div class="ml-4 mt-1 flex items-center">
            <p class="mr-8">
              新しい名前:
            </p>
            <input
              v-model="newName"
              class="border-skgray focus:border-skwhite-dark border-[1px] focus:outline-none p-1 rounded-md"
            >
            <button
              class="rounded-md ml-4 bg-skgreen-light hover:bg-skgreen py-2
              px-4 text-skdark hover:text-skwhite-dark"
              @click="onDisplaynameChangeRequest"
            >
              <div v-if="isShowingChangeNameSuccess">
                <font-awesome-icon icon="fa-solid fa-circle-check" class="mr-2" />更新しました
              </div>
              <div v-else>
                <div v-if="!isChangingName">
                  変更する
                </div>
                <div v-else>
                  changing...
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import { User } from '@firebase/auth';
import Vue, { PropType } from 'vue';
import { ConfirmDialog } from '../misc/Dialog.vue';
import { changeDisplayName } from '~/lib/user';

export default Vue.extend({
  name: 'Setting',

  props: {
    me: {
      type: Object as PropType<User>,
      required: true,
    },
  },

  data () {
    return {
      newName: '',
      isChangingName: false,
      isShowingChangeNameSuccess: false,
      dialogShowing: false,
      dialogConfig: {
        typ: 'confirm',
        title: '',
        closeText: 'OK',
        closeEmission: 'dialogAlertOk',
      } as ConfirmDialog,
      dialogSentence: '',
    };
  },

  methods: {
    async onDisplaynameChangeRequest () {
      if (this.isChangingName === true || this.isShowingChangeNameSuccess === true) { return; }
      this.isChangingName = true;

      const result = await changeDisplayName(this.newName);
      if (result !== null) {
        // eslint-disable-next-line no-console
        console.error('Failed to change displayName: ', result);
        this.showNameChangeFailureDialog(result);
      } else {
        this.isShowingChangeNameSuccess = true;
        setTimeout(() => { this.isShowingChangeNameSuccess = false; }, 3000);
        this.$store.commit('commitUserName', this.newName);
      }

      this.newName = '';
      this.isChangingName = false;
    },

    showNameChangeFailureDialog (errorMsg: string) {
      this.dialogShowing = true;
      const dialog: ConfirmDialog = {
        typ: 'confirm',
        title: '表示名の変更に失敗しました',
        closeText: 'OK',
        closeEmission: 'dialogAlertOk',
      };
      this.dialogSentence = errorMsg;
      this.dialogConfig = dialog;
    },
  },
});

</script>

<style>
input {
  background-color: #1A1423;
  border-color: #EBDBB2;
}
</style>
