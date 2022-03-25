<template>
  <div class="bg-skwhite w-full h-full">
    <div class="flex justify-between items-end">
      <wywiwya-logo />
      <div class="mr-8">
        <me-badge />
      </div>
    </div>
    <div class="w-7/12 h-screen mx-auto">
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
