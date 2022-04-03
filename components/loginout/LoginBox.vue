<template>
  <layout-wrapper>
    <div
      class="bg-skdark h-96 rounded-xl px-3 py-3
      shadow-2xl flex flex-col text-center justify-between border-2 border-skgray"
    >
      <misc-dialog
        v-show="dialogShowing"
        :config="failDialogConfig"
        @failAlertOk="dialogShowing = false"
      >
        <div class="flex flex-col">
          <div>
            ログインに失敗しました。
          </div>
          <div>
            少し時間をおいて、画面をリロードしてから再試行してください。
          </div>
        </div>
      </misc-dialog>

      <div>
        <div class="text-3xl text-center my-6">
          Signin with GitHub
        </div>

        <button
          class="rounded-xl bg-gray-700 hover:bg-gray-800 w-2/3 mx-auto p-1 mb-2 flex items-center"
          @click="doLogin"
        >
          <img src="~/static/3rd/github/GitHub-Mark-Light-32px.png" class="mx-2">
          <p class="text-skwhite-light ml-2">
            Signin with GitHub
          </p>
        </button>

        <div class="textsm my-6">
          ボタンを押してGitHubでログイン
        </div>
      </div>

      <div>
        <vue-loading v-show="isLoading" />
      </div>

      <div class="mt-2 text-sm text-skgray">
        サインインすることで
        <NuxtLink to="/disclaimer" class="text-skgreen-light">
          免責事項
        </NuxtLink>
        に<br>同意したものと見なします。
      </div>

      <div class="text-right flex flex-col text-xs mx-4 text-gray-600">
        <div class="my-1">
          <nuxt-link to="/privacy">
            利用する情報について
          </nuxt-link>
        </div>
        <div class="my-1">
          <nuxt-link to="/disclaimer">
            免責事項
          </nuxt-link>
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { Login } from '@/lib/auth';
import { ConfirmDialog } from '~/components/misc/Dialog.vue';

const FailDialogConfig: ConfirmDialog = {
  typ: 'confirm',
  title: 'ログインに失敗しました',
  closeText: 'OK',
  closeEmission: 'failAlertOk',
};

export default Vue.extend({
  name: 'LoginBox',

  data () {
    return {
      isLoading: false,
      dialogShowing: false,
      failDialogConfig: FailDialogConfig,
    };
  },

  methods: {
    async doLogin () {
      this.isLoading = true;
      const error = await Login();
      if (error === null) {
        this.isLoading = false;
        this.$router.push('/');
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to login.');
      }
    },
  },
});
</script>
