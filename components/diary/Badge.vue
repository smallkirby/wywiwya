<template>
  <layout-wrapper>
    <div
      v-if="author!== null"
      class="rounded-xl px-2 md:px-4 py-3 border-2 border-skgray-dark hover:border-skwhite-dark shadow-2xl pt-4"
    >
      <button class="w-full h-full flex flex-col md:flex-row justify-between items-lfet text-left">
        <!-- LEFT -->
        <div
          class="flex flex-col md:pr-6 pb-4 md:pb-0
        border-b-2 md:border-b-0 md:border-r-2 border-skgray-dark whitespace-nowrap"
        >
          <div class="text-xl md:mr-2 mb-2 flex items-center justify-between">
            <div>
              {{ dateString }}
            </div>
            <div class="md:hidden text-sm text-skgray flex flex-col ml-2 w-full">
              <div>
                最終更新:
              </div>
              <div class="ml-2">
                {{ lastUpdateString }}
              </div>
            </div>
          </div>
          <div class="flex items-center">
            <div class="mr-4">
              <img :src="author.photoURL" class="w-8 rounded-full">
            </div>
            <div class="mb-1">
              {{ author.displayName }}
            </div>
          </div>
          <div class="text-skgray mt-2 text-sm flex-col hidden md:flex">
            <div>
              最終更新:
            </div>
            <div class="ml-2">
              {{ lastUpdateString }}
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="w-full flex flex-col md:mx-4 pt-4 md:pt-0">
          <div class="text-2xl mb-2">
            {{ title }}
          </div>
          <div class="ml-4 overflow-hidden h-16 text-ellipsis">
            <div ref="badgeDiaryContent" />
          </div>
        </div>
      </button>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Diary } from '~/typings/diary';
import { User } from '~/store/state';
import { did2string } from '~/lib/util/diary';
import { fetchUser } from '~/lib/user';
import { date2string } from '~/lib/util/date';
import { extractTitle, extractContentHtml } from '~/lib/md';

export default Vue.extend({
  name: 'DiaryBadge',

  props: {
    diary: {
      type: Object as PropType<Diary>,
      required: true,
    },
  },

  data () {
    return {
      author: null as User | null,
      content: '',
    };
  },

  computed: {
    dateString () {
      return did2string(this.diary.dateID);
    },

    lastUpdateString () {
      return date2string(this.diary.lastUpdatedAt);
    },

    title () {
      // @ts-ignore
      const nullableTtile = extractTitle(this.diary.contentMd);
      return nullableTtile === null ? '(no title)' : nullableTtile;
    },
  },

  async created () {
    // @ts-ignore
    const user = await fetchUser(this.diary.author);
    // @ts-ignore
    this.author = user;
  },

  mounted () {
    const interval = setInterval(() => {
      // @ts-ignore
      if (this.$refs.badgeDiaryContent) {
        // @ts-ignore
        this.$refs.badgeDiaryContent.innerHTML = extractContentHtml(this.diary.contentMd);
        clearInterval(interval);
      }
    }, 100);
  },
});
</script>
