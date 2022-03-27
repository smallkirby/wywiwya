<template>
  <div class="bg-white border-2 rounded-sm py-2 px-2 mr-4 h-full w-full">
    <div id="previewBox" ref="previewBox" class="h-full w-full px-8 ml-4 mr-4 overflow-y-scroll" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MarkdownIt from 'markdown-it';

export default Vue.extend({
  name: 'PreviewBox',

  data () {
    return {
      md: null as MarkdownIt | null,
    };
  },

  mounted () {
    this.md = new MarkdownIt({
      html: true,
      xhtmlOut: true,
      breaks: false,
    });
  },

  methods: {
    compileWrite (mdCode: string) {
      if (this.md === null) { return; }
      const code = this.md.render(mdCode);
      (this.$refs.previewBox!! as any).innerHTML = code;
    },
  },
});

</script>

<style lang="scss">

#previewBox {
  @import'../../node_modules/bootstrap/scss/bootstrap';
  height: calc(100vh - 150px) !important;
  padding-bottom: 30px;
}
</style>
