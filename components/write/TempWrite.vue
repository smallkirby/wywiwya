<template>
  <layout-wrapper>
    <div class="flex flex-col">
      <div class="text-2xl mb-3">
        <font-awesome-icon icon="fa-solid fa-circle-check" />
        書きかけのDiaryを完成させる
      </div>
      <div class="ml-12 flex flex-col">
        <div>
          書きかけの Diary はありません。
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';

export default Vue.extend({
  name: 'TempWrite',

  computed: {
    todayString () {
      return moment().format('YYYY年MM月DD日');
    },
  },
});

</script>
