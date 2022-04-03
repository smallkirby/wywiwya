<template>
  <div class="bg-skdark-dark w-full min-h-full h-auto text-skwhite-dark">
    <div class="flex justify-between items-center md:items-end flex-col md:flex-row">
      <wywiwya-logo />
      <div class="md:mr-8">
        <user-me-badge />
      </div>
    </div>
    <div class="w-full md:w-7/12 mx-auto min-h-screen h-auto">
      <layout-header />
      <div class="my-4">
        <div>
          <Nuxt v-if="me !== 'trying'" />
        </div>
      </div>
    </div>
    <div>
      <layout-footer />
    </div>
  </div>
</template>

<script lang="ts">

/*
  This layout wait until `state.user` is set to null or User.
  This means that pages has no need to wait until `state.user` is set.
  If `state.user` is null in page component, it means user is not logged in.
*/

import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'DefaultLayout',

  computed: {
    ...mapGetters([
      'me',
    ]),
  },
});
</script>

<style lang="scss">
@import '~/static/css/tooltip.css';
@import '~/static/css/toggle.css';

body {
  font-family: 'Ubuntu Mono';
}
</style>
