<template>
  <div
    class="border-t-2 border-b-2 border-skgray-dark rounded-2xl
  pt-6 pb-2 px-2 ml-2 mr-4 h-full w-full bg-skdark-dark"
  >
    <div
      id="previewBox"
      ref="previewBox"
      class="h-full w-full pl-2 pr-8 ml-4 mr-4 overflow-y-scroll"
    />
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
  height: calc(100vh - 195px) !important;
  padding-bottom: 30px;
}

#previewBox h1,h2,h3,h4,h5 {
  margin-top: 0.8rem;
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  padding-right: 2.0rem;
  border-bottom: solid 1px;
  border-color: rgba(23, 33, 49, var(--tw-border-opacity));
}

#previewBox h1,h2,h3,h4,h5:first-child {
  margin-top: 0rem;
  padding-top: 0rem;
}

#previewBox p {
  padding-left: 1rem;
}

#previewBox li {
  list-style: square;
  margin-bottom: 0.2rem;
}

#previewBox strong {
  color: #B16286;
}

#previewBox code {
  color: #6272A4;
}

#previewBox a {
  color: #076678;
}

</style>
