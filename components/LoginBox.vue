<template>
  <layout-wrapper>
    <div
      class="bg-white h-96 rounded-xl px-3 py-3
      shadow-2xl flex flex-col text-center justify-between"
    >
      <div>
        <div class="text-3xl text-center my-6">
          Signin with GitHub
        </div>

        <button class="rounded-xl bg-gray-700 w-2/3 mx-auto p-1 mb-2 flex items-center" @click="doLogin">
          <img src="~/static/3rd/github/GitHub-Mark-Light-32px.png" class="mx-2">
          <p class="text-skwhite-light ml-2">
            Signin with GitHub
          </p>
        </button>

        <div class="textsm my-6">
          ボタンを押してGitHubでログイン
        </div>
      </div>

      <div class="text-right flex flex-col text-xs mx-4 text-gray-600">
        <div class="my-1">
          <nuxt-link to="/">
            利用する情報について
          </nuxt-link>
        </div>
        <div class="my-1">
          <nuxt-link to="/">
            パスワードを忘れた場合
          </nuxt-link>
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { Login } from '@/lib/auth';

export default Vue.extend({
  name: 'LoginBox',
  data () {
    return {};
  },

  methods: {
    async doLogin () {
      await Login();
      this.$router.push('/');
    },
  },
});
</script>
