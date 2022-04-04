<template>
  <layout-wrapper>
    <div class="border-2 border-skgray rounded-lg md:p-4 md:px-6 flex flex-col md:flex-row justify-center py-4 text-sm">
      <div class="flex flex-col w-full md:w-3/5 text-center md:px-4 md:mr-4">
        <div class="pb-4 border-b-2 border-skgray-dark">
          <div class="md:text-lg mb-4">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            日付から選択
          </div>
          <div>
            検索したい日付の範囲を選択してください
          </div>
        </div>

        <div class="pb-4 mt-4 border-b-2 border-skgray-dark">
          <p class="mb-2">
            現在の指定
          </p>
          <div v-if="startTimeString !== null && endTimeString !== null">
            {{ startTimeString }} ~ {{ endTimeString }}
          </div>
          <div v-else class="text-skgray">
            <p>(指定なし)</p>
          </div>
        </div>

        <div class="mt-4">
          <button
            class="rounded-md px-4 py-2 bg-skgreen-light hover:bg-skgreen text-skdark hover:text-skwhite-dark mb-4"
            :disabled="startTimeString === null || endTimeString === null"
            @click="requestDateSearch"
          >
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            検索する
          </button>
        </div>
      </div>
      <div class="w-full md:w-2/5 mx-auto px-auto items-center text-center">
        <v-date-picker
          v-model="selectedRange"
          is-dark
          is-range
          color="blue"
          class="mx-auto px-auto w-full"
        />
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';

export default Vue.extend({
  name: 'SearchBox',

  data () {
    return {
      selectedRange: {
        start: null,
        end: null,
      },
    };
  },

  computed: {
    startTimeString () {
      // @ts-ignore
      const range = this.selectedRange;
      if (this.selectedRange.start !== null) {
        return moment(range.start).format('YYYY年MM月DD日');
      } else {
        return null;
      }
    },

    endTimeString () {
      // @ts-ignore
      const range = this.selectedRange;
      if (this.selectedRange.end !== null) {
        return moment(range.end).format('YYYY年MM月DD日');
      } else {
        return null;
      }
    },
  },

  methods: {
    requestDateSearch () {
      this.$emit('requestDateSearch', this.selectedRange);
    },
  },
});
</script>
