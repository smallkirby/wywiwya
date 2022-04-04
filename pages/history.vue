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

        <div>
          <div class="text-center md:text-left mt-8">
            Diaries: {{ filteredDiaries.length }} 件
          </div>
        </div>

        <div>
          <first-diary-prompt v-if="diaries.length === 0" class="mt-4 mb-8" />

          <!-- TODO: need paging -->
          <div v-else class="mt-8 mx-2 md:ml-12 flex flex-col">
            <div v-for="(diary, ix) in filteredDiaries" :key="ix" class="mb-2 md:pr-4">
              <diary-badge :diary="diary" />
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

export const HistoryPage = Vue.extend({
  name: 'HistoryPage',

  data () {
    return {
      diaries: [] as Diary[],
      filteredDiaries: [] as Diary[],
      isDiariesFetched: false,
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
      const diaries = await fetchMyDiaries(this.me.uid, this.me.diaries.length);
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
