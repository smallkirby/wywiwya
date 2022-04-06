<template>
  <layout-wrapper>
    <div class="flex flex-col">
      <div class="text-3xl font-bold pb-2 mb-4 border-b-2 border-skdark">
        <font-awesome-icon icon="fa-solid fa-leaf" />
        コミットグラフ
      </div>

      <div class="flex flex-col md:ml-4 mt-2 items-center max-w-full">
        <div
          class="border-2 border-skgray-dark rounded-md p-2 flex w-max pl-3 pt-3
          overflow-x-scroll md:overflow-x-hidden max-w-full"
        >
          <div v-for="(column, cix) in kusaEnts" :key="cix" class="flex-col">
            <div
              v-for="(ent, rix) in column"
              :key="rix"
              v-tooltip="getDateString(ent.date)"
              class="rounded-sm w-3 h-3 mr-1 mb-1"
              :class="{
                'bg-skwhite-dark': ent.isWritten === true,
                'bg-skgray-dark': ent.isWritten !== true,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import { Moment } from 'moment';
import Vue, { PropType } from 'vue';
import { getKusaEntries, KusaEntry } from '~/lib/kusa';
import { User } from '~/store/state';

export default Vue.extend({
  name: 'Kusa',

  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },

  data () {
    return {
      kusaEnts: [] as KusaEntry[][],
    };
  },

  mounted () {
    this.kusaEnts = getKusaEntries(this.user.kusa);
  },

  methods: {
    getDateString (m: Moment) {
      return m.format('YYYY年MM月DD日');
    },
  },
});
</script>
