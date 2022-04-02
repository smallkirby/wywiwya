<template>
  <layout-wrapper>
    <layout-main-box>
      <div>
        <div>
          Diaries: {{ numDiaries }} 件
        </div>
      </div>

      <div>
        <div>
          <vue-loading v-show="!isDiariesFetched" />
        </div>
        <div v-show="isDiariesFetched">
          <first-diary-prompt v-if="numDiaries === 0" class="mt-4 mb-8" />

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
    numDiaries () {
      if (this.me === null) {
        return 0;
      } else {
        return this.me.numDiaries;
      }
    },

    ...mapGetters([
      'me',
    ]),
  },

  watch: {
    async me () {
      // @ts-ignore
      if (!this.isDiariesFetched) {
        // @ts-ignore
        await this.fetchDiaries();
        // @ts-ignore
        this.isDiariesFetched = true;
      }
    },
  },

  async mounted () {
    if (this.me) {
      // @ts-ignore
      await this.fetchDiaries();
      // @ts-ignore
      this.isDiariesFetched = true;
    }
  },

  methods: {
    fetchDiaries () {
      const interval = setInterval(async () => {
        if (this.me.numDiaries !== null && this.me.numDiaries > 0) {
          clearInterval(interval);
        } else {
          return;
        }

        const diaries = await fetchMyDiaries(this.me.uid, this.me.numDiaries);
        if (diaries === null) {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch diaries...');
          return;
        }

        // @ts-ignore
        this.diaries = diaries;
      }, 500);
    },
  },
});

export default HistoryPage;

</script>
