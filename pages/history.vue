<template>
  <layout-wrapper>
    <layout-main-box>
      <div>
        <div>
          Diaries: {{ numDiaries }} 件
        </div>
      </div>
    </layout-main-box>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export const HistoryPage = Vue.extend({
  name: 'HistoryPage',

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
});

export default HistoryPage;

</script>
