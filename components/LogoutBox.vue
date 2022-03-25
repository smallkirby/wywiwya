<template>
  <layout-wrapper>
    <div
      class="bg-white h-52 rounded-xl px-3 py-3
      shadow-2xl flex flex-col text-center justify-between"
    >
      <div>
        <div class="text-3xl text-center my-6">
          ログアウトしますか？
        </div>

        <button class="rounded-xl bg-red-400 w-2/3 mx-auto p-1 mb-2 flex items-center py-2" @click="doLogout">
          <img src="~/static/3rd/other/crying-26.png" class="mx-2">
          <p class="text-black w-full text-center pr-8">
            Logout
          </p>
        </button>

        <div class="textsm my-6">
          ボタンを押してさようなら
        </div>

        <div>
          <vue-loading v-show="isLoading" />
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LogoutBox',
  data () {
    return {
      isLoading: false,
    };
  },

  methods: {
    async doLogout () {
      this.isLoading = true;
      await this.$store.dispatch('signout');
      this.isLoading = false;

      this.$router.push('/');
    },
  },
});
</script>
