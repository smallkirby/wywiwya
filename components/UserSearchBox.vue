<template>
  <layout-wrapper>
    <div class="border-2 border-skgray rounded-lg p-4 flex flex-col">
      <div class="text-center">
        ユーザ名の全体または一部を入力してユーザを検索する
      </div>
      <div class="text-center text-skgray">
        (現在は、完全一致による検索のみサポートしています)
      </div>
      <div class="text-center text-skgray">
        (空白のまま検索すると、ユーザ全員を表示します。この機能は削除予定です。)
      </div>
      <div class="mt-4 ml-4 flex items-center justify-center">
        <button class="rounded-md hover:bg-skwhite-dark hover:text-skdark w-8 h-8 mr-2" @click="onSearchRequest">
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
        </button>
        <input
          v-model="searchStr"
          class="border-skgray focus:border-skwhite-dark border-[1px] focus:outline-none
          p-1 rounded-md w-3/5 px-2 bg-skdark"
        >
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'UserSearchBox',

  data () {
    return {
      searchStr: '',
    };
  },

  methods: {
    onSearchRequest () {
      this.$emit('requestSearch', this.searchStr);
    },
  },
});
</script>
