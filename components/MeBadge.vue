<template>
  <layout-wrapper>
    <div class="bg-white rounded-xl shadow-xl w-56  h-12 mt-4 py-2 px-3">
      <nuxt-link v-if="me !== null" class="flex items-center w-full" :to="toPath">
        <img :src="me.photoURL" class="w-8 rounded-full mr-4">
        <p> {{ me.displayName }} </p>
      </nuxt-link>
      <nuxt-link v-else class="w-full mt-2" :to="toPath">
        <p class="mt-1 ml-2">
          not logged in
        </p>
      </nuxt-link>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Login } from '@/lib/auth';

export default Vue.extend({
  name: 'MeBadge',
  data () {
    return {};
  },

  computed: {
    toPath () {
      if (this.isLoggedIn) {
        return '/profile';
      } else {
        return '/login';
      }
    },
    ...mapGetters([
      'me',
      'isLoggedIn',
    ]),
  },

  methods: {
    async doLogin () {
      await Login();
      this.$router.push('/');
    },
  },
});
</script>
