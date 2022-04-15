<template>
  <layout-wrapper>
    <div class="flex flex-col">
      <div class="text-2xl mb-3">
        <font-awesome-icon icon="fa-solid fa-circle-check" />
        書きかけの Diary を完成させる
      </div>
      <div class="ml-2 md:ml-12 flex flex-col mt-2">
        <div v-show="tempDiaries !== null">
          <div v-for="(diary, ix) in tempDiaries" :key="ix" class="mb-2 md:pr-4">
            <diary-badge :diary="diary" />
          </div>
        </div>

        <div v-show="tempDiaries === null || tempDiaries.length === 0">
          書きかけの Diary はありません。
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import moment from 'moment';
import { User } from '~/store/state';
import { fetchMyTemporaryDiaries } from '~/lib/diary';
import { Diary } from '~/typings/diary';

export default Vue.extend({
  name: 'TempWrite',

  props: {
    me: {
      type: Object as PropType<User>,
      required: true,
    },
  },

  data () {
    return {
      tempDiaries: null as Diary[] | null,
    };
  },

  computed: {
    todayString () {
      return moment().format('YYYY年MM月DD日');
    },
  },

  async mounted () {
    const tempDiaries = await fetchMyTemporaryDiaries(this.me);
    if (tempDiaries !== null) {
      this.tempDiaries = tempDiaries;
    }
  },
});

</script>
