<template>
  <layout-wrapper>
    <layout-main-box>
      <div v-if="isDiariesFetched === false">
        <vue-loading />
      </div>

      <div v-else>
        <div>
          <div class="text-center md:text-left">
            Diaries: {{ diaries.length }} 件
          </div>
        </div>

        <div>
          <first-diary-prompt v-if="diaries.length === 0" class="mt-4 mb-8" />

          <!-- TODO: need paging -->
          <div v-else class="mt-8 ml-2 md:ml-12 flex flex-col">
            <div v-for="(diary, ix) in diaries" :key="ix" class="mb-2 md:pr-4">
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
  },
});

export default HistoryPage;

</script>
