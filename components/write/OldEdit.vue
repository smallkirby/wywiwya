<template>
  <layout-wrapper>
    <div class="flex flex-col">
      <div class="text-2xl mb-3">
        <font-awesome-icon icon="fa-solid fa-pen" />
        過去の Diary を編集する
      </div>
      <div class="ml-2 md:ml-12 flex flex-col">
        <div v-if="oldDiaries.length === 0">
          まだ Diary を書いていません。
        </div>
        <div v-for="(diary, ix) in oldDiaries" v-else :key="ix" class="mb-2 md:pr-4">
          <diary-badge :diary="diary" />
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import moment from 'moment';
import { User } from '~/store/state';
import { Diary } from '~/typings/diary';
import { fetchMyDiaries } from '~/lib/diary';

export default Vue.extend({
  name: 'OldEdit',

  props: {
    me: {
      type: Object as PropType<User>,
      required: true,
    },
  },

  data () {
    return {
      oldDiaries: [] as Diary[],
    };
  },

  computed: {
    todayString () {
      return moment().format('YYYY年MM月DD日');
    },
  },

  async mounted () {
    const oldDiaries = await fetchMyDiaries(this.me, 3, 0);
    if (oldDiaries === null) {
      // eslint-disable-next-line no-console
      console.error('Failed to old diaries.');
    } else {
      this.oldDiaries = oldDiaries;
    }
  },
});

</script>
