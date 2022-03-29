<template>
  <div class="bg-skdark-dark w-full min-h-full h-auto text-skwhite-dark">
    <div class="flex justify-between items-center md:items-end flex-col md:flex-row">
      <wywiwya-logo />
      <div class="md:mr-8">
        <me-badge />
      </div>
    </div>
    <div class="w-full mx-auto min-h-screen h-auto">
      <layout-header />
      <div class="my-4">
        <Nuxt />
      </div>
    </div>
    <div>
      <layout-footer />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'FullLayout',
});
</script>

<style>
@import '~/static/css/tooltip.css';
@import '~/static/css/toggle.css';

body {
  font-family: 'Ubuntu Mono';
}
</style>
