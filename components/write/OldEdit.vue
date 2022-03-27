<template>
  <layout-wrapper>
    <div class="flex flex-col">
      <div class="text-2xl mb-3">
        <font-awesome-icon icon="fa-solid fa-pen" />
        過去の Diary を編集する
      </div>
      <div class="ml-12 flex flex-col">
        <div>
          まだ Diary を書いていません。
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';

export default Vue.extend({
  name: 'OldEdit',

  computed: {
    todayString () {
      return moment().format('YYYY年MM月DD日');
    },
  },
});

</script>
