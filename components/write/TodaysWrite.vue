<template>
  <layout-wrapper>
    <div class="flex flex-col">
      <div class="text-2xl mb-3">
        <font-awesome-icon icon="fa-solid fa-circle-plus" />
        今日のDiaryを書く
      </div>
      <div class="ml-12 flex flex-col">
        <div>
          {{ todayString }}のDiary はまだありません。
        </div>
        <div class="text-center justify-center">
          <button
            class="bg-skgreen-light hover:bg-skgreen-dark rounded-xl py-2 px-4 my-2 w-2/3
            flex justify-center items-center mx-auto
          "
          >
            <font-awesome-icon icon="fa-solid fa-circle-plus" />
            <div class="mx-2">
              今日のDiaryを書く
            </div>
          </button>
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';

export default Vue.extend({
  name: 'TodaysWrite',

  computed: {
    todayString () {
      return moment().format('YYYY年MM月DD日');
    },
  },
});

</script>
