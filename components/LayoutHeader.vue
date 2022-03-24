<template>
  <layout-wrapper>
    <header class="h-12 pt-2 pb-4">
      <div class="flex">
        <div v-for="(item,ix) in headerEntries" :key="ix">
          <header-button :entry="item" :selected="button_route_same(item.to)" />
        </div>
      </div>
    </header>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { HeaderButtonEntry } from './HeaderButton.vue';

export default Vue.extend({
  name: 'LayoutHeader',

  data () {
    return {
      headerEntries: [
        {
          text: 'Home',
          to: '/',
        },
        {
          text: 'About',
          to: '/about',
        },
        {
          text: 'Write Diary',
          to: '/write',
        },
        {
          text: 'History',
          to: '/history',
        },
      ] as HeaderButtonEntry[],
    };
  },

  created () {
    // TODO: check login status
    this.headerEntries.push({
      text: 'Login',
      to: '/login',
    });
  },

  methods: {
    button_route_same: function (to: string) {
      const currentRoute = this.$route.name;
      return `/${currentRoute}` === to || (currentRoute === 'index' && to === '/');
    },
  },
});
</script>
