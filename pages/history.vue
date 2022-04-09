<template>
  <layout-wrapper>
    <layout-main-box>
      <div v-if="isDiariesFetched === false">
        <vue-loading />
      </div>

      <div v-else class="md:mx-10 mt-2 flex flex-col">
        <div>
          <div class="text-center md:text-left text-2xl md:text-3xl">
            <font-awesome-icon icon="fa-solid fa-book" />
            Here is What You Are...
          </div>
        </div>

        <div class="w-full md:mx-4 md:px-8 mt-4 mb-4 px-2">
          <diary-search-box @requestDateSearch="onRequestDateSearch" />
        </div>

        <div class="flex mt-8">
          <div class="text-center md:text-left">
            Diaries: {{ me.diaries.length }} 件
          </div>
        </div>

        <!-- PAGINATION -->
        <div class="flex items-center mt-2 mx-auto">
          <button
            v-for="ix in Array(Math.ceil(me.diaries.length / 5)).keys()"
            :key="ix"
            class="border-2 rounded-md px-2 mx-1 hover:border-skwhite-dark"
            :class="{
              'border-skdark-light': page === ix,
              'border-skdark': page !== ix,
            }"
          >
            {{ ix + 1 }}
          </button>
        </div>

        <div>
          <first-diary-prompt v-if="diaries.length === 0 && page === 0" class="mt-4 mb-8" />

          <div v-else class="mt-8 mx-2 md:ml-12 flex flex-col">
            <div v-for="(diary, ix) in filteredDiaries" :key="ix" class="mb-2 md:pr-4">
              <diary-badge :diary="diary" class="mb-6" />
            </div>
          </div>
        </div>
      </div>
    </layout-main-box>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { fetchMyDiaries } from '~/lib/diary';
import { Diary } from '~/typings/diary';

const DATA_BLOCK_LIMIT = 10;

export const HistoryPage = Vue.extend({
  name: 'HistoryPage',

  data () {
    return {
      diaries: [] as Diary[],
      filteredDiaries: [] as Diary[],
      isDiariesFetched: false,
      page: 0,
    };
  },

  computed: {
    ...mapGetters([
      'me',
    ]),
  },

  async mounted () {
    if (this.me) {
      this.diaries = await this.fetchDiaries();
      this.filteredDiaries = this.diaries;
      this.sortDiaries();
    }
    this.isDiariesFetched = true;
  },

  methods: {
    async fetchDiaries (): Promise<Diary[]> {
      const diaries = await fetchMyDiaries(this.me.uid, DATA_BLOCK_LIMIT);
      if (diaries === null) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch diaries...');
        return [];
      }
      return diaries;
    },

    onRequestDateSearch (range: { start: Date | null, end: Date | null }) {
      if (range.start === null || range.end === null) {
        return;
      }
      range.start.setHours(0);
      range.start.setMinutes(0);
      range.start.setSeconds(0);
      range.end.setHours(0);
      range.end.setMinutes(0);
      range.end.setSeconds(0);
      this.filteredDiaries = this.diaries.filter((diary: Diary) => {
        const time = diary.createdAt.getTime();
        return range.start!!.getTime() <= time && time <= range.end!!.getTime();
      });
      this.sortDiaries();
    },

    sortDiaries () {
      this.filteredDiaries = this.filteredDiaries.sort((a: Diary, b: Diary) => {
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    },
  },
});

export default HistoryPage;

</script>
