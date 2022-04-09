<template>
  <div class="bg-skdark-dark w-full min-h-full h-auto text-skwhite-dark">
    <div class="flex justify-between items-center md:items-end flex-col md:flex-row">
      <wywiwya-logo />
      <div class="md:mr-8 flex justify-center items-center">
        <notification-badge />
        <user-me-badge />
      </div>
    </div>
    <div class="w-full mx-auto min-h-screen h-auto">
      <layout-header />
      <div class="my-4">
        <div v-if="me !== 'trying'">
          <Nuxt />
        </div>
      </div>
    </div>
    <div>
      <layout-footer />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'FullLayout',

  computed: {
    ...mapGetters([
      'me',
    ]),
  },
});
</script>

<style>
@import '~/static/css/tooltip.css';
@import '~/static/css/toggle.css';

body {
  font-family: 'Ubuntu Mono';
}

body::-webkit-scrollbar {
  width: 0.7em;
}

body::-webkit-scrollbar-track {
  background: #130F1A;
}

body::-webkit-scrollbar-thumb {
  background: #172131;
}
</style>
