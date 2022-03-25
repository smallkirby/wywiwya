<template>
  <layout-wrapper>
    <header class="mx-2 h-12 pt-3 pb-4 md:block overflow-x-scroll overflow-y-hidden md:overflow-hidden">
      <div class="flex mx-auto justify-center">
        <div v-for="(item,ix) in headerEntries" :key="ix">
          <header-button :entry="item" :selected="button_route_same(item.to)" />
        </div>
      </div>
    </header>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { HeaderButtonEntry } from './HeaderButton.vue';

const headerentriesBase: HeaderButtonEntry[] = [
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
];
const loginEntry: HeaderButtonEntry = {
  text: 'Login',
  to: '/login',
};
const logoutEntry: HeaderButtonEntry = {
  text: 'Logout',
  to: '/logout',
};

export default Vue.extend({
  name: 'LayoutHeader',

  data () {
    return {
      headerEntries: [
        ...headerentriesBase,
      ] as HeaderButtonEntry[],
    };
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
    ]),
  },

  watch: {
    isLoggedIn (newValue: boolean) {
      if (newValue) {
        this.headerEntries = headerentriesBase.concat([logoutEntry]);
      } else {
        this.headerEntries = headerentriesBase.concat([loginEntry]);
      }
    },
  },

  created () {
    if (this.isLoggedIn === true) {
      this.headerEntries.push(logoutEntry);
    } else {
      this.headerEntries.push(logoutEntry);
    }
  },

  methods: {
    button_route_same: function (to: string) {
      const currentRoute = this.$route.name;
      return `/${currentRoute}` === to || (currentRoute === 'index' && to === '/');
    },
  },
});
</script>
