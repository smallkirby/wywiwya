<template>
  <layout-wrapper>
    <div class="bg-white rounded-xl shadow-xl w-56  h-12 mt-4 py-2 px-3">
      <button v-if="me !== null" class="flex items-center w-full">
        <img :src="me.photoURL" class="w-8 rounded-full mr-4">
        <p> {{ me.displayName }} </p>
      </button>
      <button v-else class="w-full pt-1">
        not logged in
      </button>
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
    ...mapGetters([
      'me',
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
