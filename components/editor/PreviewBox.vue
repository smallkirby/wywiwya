<template>
  <div
    class="border-t-2 border-b-2 border-skgray-dark rounded-2xl
  pt-6 pb-2 px-2 ml-2 mr-4 h-full w-full bg-skdark-dark overflow-x-hidden"
  >
    <iframe
      id="previewBox"
      ref="previewBox"
      sandbox="allow-same-origin allow-popups"
      class="h-full w-full pl-2 pr-8 ml-4 mr-4 overflow-y-scroll overflow-x-hidden"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { compile2mdStyled } from '~/lib/md';

export default Vue.extend({
  name: 'PreviewBox',

  methods: {
    compileWrite (mdCode: string) {
      const code = compile2mdStyled(mdCode);
      (this.$refs.previewBox!! as any).srcdoc = code;
    },
  },
});

</script>

<style lang="scss">
#previewBox {
  height: calc(100vh - 195px) !important;
  padding-bottom: 30px;
}

</style>
