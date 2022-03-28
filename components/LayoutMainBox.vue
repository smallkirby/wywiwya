<template>
  <div
    class="wrapper bg-skdark-dark shadow-2xl rounded-xl p-4 min-h-screen
  h-auto mx-2 mb-10 border-l-2 border-r-2 border-skgray text-skwhite-dark"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'LayoutMainBox',
};
</script>
