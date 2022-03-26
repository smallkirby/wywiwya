<template>
  <div class="bg-skwhite w-full min-h-full h-auto">
    <div class="flex justify-between items-center md:items-end flex-col md:flex-row">
      <wywiwya-logo />
      <div class="md:mr-8">
        <me-badge />
      </div>
    </div>
    <div class="w-full md:w-7/12 mx-auto min-h-screen h-auto">
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

<script>
export default {
};
</script>

<style>
body {
  font-family: 'Ubuntu Mono';
}
</style>
