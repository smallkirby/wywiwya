<template>
  <layout-wrapper>
    <header class="h-12 py-2">
      <div class="flex">
        <div v-for="(item,ix) in headerButtons" :key="ix">
          <header-button :entry="item" />
        </div>
      </div>
    </header>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { HeaderButtonEntry } from './HeaderButton.vue';

const headerEntries: HeaderButtonEntry[] = [
  {
    text: 'Home',
  },
  {
    text: 'About',
  },
  {
    text: 'Write Diary',
  },
  {
    text: 'History',
  },
];

export default Vue.extend({
  name: 'LayoutHeader',

  data () {
    return {
      headerButtons: headerEntries,
    };
  },
});
</script>
