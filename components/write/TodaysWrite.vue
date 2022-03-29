<template>
  <layout-wrapper>
    <div class="flex flex-col">
      <div>
        <div class="text-2xl mb-3">
          <font-awesome-icon icon="fa-solid fa-circle-plus" />
          今日のDiaryを書く
        </div>
        <div class="ml-3 md:ml-12 flex flex-col">
          <div v-if="todaysDiary === null">
            {{ todayString }}の Diary はまだありません。
          </div>
          <div v-else>
            {{ todayString }}の Diary は既に存在します。
          </div>

          <div class="text-center justify-center">
            <button
              v-if="todaysDiary === null"
              class="bg-skgreen-light hover:bg-skgreen-dark rounded-xl py-2 px-4 my-2 w-2/3 text-skdark
              flex justify-center items-center mx-auto
            "
              @click="onClick"
            >
              <font-awesome-icon icon="fa-solid fa-circle-plus" />
              <div class="mx-2">
                今日のDiaryを書く
              </div>
            </button>
            <button
              v-else
              disabled
              class="bg-skgreen-dark rounded-xl py-2 px-4 my-2 w-2/3
              flex justify-center items-center mx-auto
            "
            >
              <font-awesome-icon icon="fa-solid fa-circle-plus" />
              <div class="mx-2">
                今日のDiaryを書く (作成済み)
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
import { mapGetters } from 'vuex';
import { fetchTodaysDiary } from '~/lib/diary';
import { Diary } from '~/typings/diary';

export default Vue.extend({
  name: 'TodaysWrite',

  data () {
    return {
      todaysDiary: null as Diary | null,
      isLoading: false,
    };
  },

  computed: {
    todayString () {
      return moment().format('YYYY年MM月DD日');
    },
    ...mapGetters([
      'me',
    ]),
  },

  watch: {
    async me () {
      if (this.todaysDiary === null) {
        await this.updateTodaysDiary();
      }
    },
  },

  async mounted () {
    await this.updateTodaysDiary();
  },

  methods: {
    async updateTodaysDiary () {
      if (this.todaysDiary === null && this.me !== null) {
        this.todaysDiary = await fetchTodaysDiary(this.me);
      }
    },

    onClick () {
      this.$emit('requestNewWrite');
    },
  },
});

</script>
