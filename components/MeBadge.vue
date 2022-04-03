<template>
  <layout-wrapper>
    <div
      class="bg-skdark rounded-xl shadow-xl h-13 mt-4 py-2 px-6
    border-t-2 border-b-2 border-skgray hover:bg-skdark-light"
    >
      <nuxt-link v-if="me !== null && me !== 'trying'" class="flex items-center w-full justify-center" :to="toPath">
        <img
          v-if="photoUrlValid"
          :src="me.photoURL"
          class="w-8 rounded-full mr-4"
          @error="photoUrlValid = !photoUrlValid"
        >
        <font-awesome-icon v-else icon="fa-solid fa-question" class="rounded-full w-8 text-2xl mr-2" />
        <p> {{ me.displayName }} </p>
      </nuxt-link>
      <nuxt-link v-else class="w-full mt-2 text-center" :to="toPath">
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
    return {
      photoUrlValid: true,
    };
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

  watch: {
    isLoggedIn () {
      this.photoUrlValid = true;
    },
  },

  methods: {
    async doLogin () {
      await Login();
      this.$router.push('/');
    },
  },
});
</script>
