<template>
  <div
    class="border-t-2 border-b-2 border-skgray-dark rounded-2xl
  pt-6 pb-2 px-2 ml-2 mr-4 h-full w-full bg-skdark-dark"
  >
    <iframe
      id="previewBox"
      ref="previewBox"
      sandbox="allow-same-origin allow-popups"
      class="h-full w-full pl-2 pr-8 ml-4 mr-4 overflow-y-scroll"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { compile2md } from '~/lib/md';

export default Vue.extend({
  name: 'PreviewBox',

  methods: {
    compileWrite (mdCode: string) {
      const code = compile2md(mdCode);
      const style = `
        <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous">
        <link rel="stylesheet" href="/css/preview-sandbox.css">
      `;
      (this.$refs.previewBox!! as any).srcdoc = style + code;
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
