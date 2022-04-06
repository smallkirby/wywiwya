<template>
  <div
    class="border-t-2 border-b-2 border-skgray-dark rounded-2xl
    pt-6 pb-2 px-2 ml-2 mr-4 h-min w-full bg-skdark-dark overflow-x-hidden"
    :class="{
      'md:border-l-2': sideBorder === true,
      'md:border-r-2': sideBorder === true,
      'border-t-0': sideBorder === true,
      'border-b-0': sideBorder === true,
    }"
  >
    <iframe
      id="previewBox"
      ref="previewBox"
      sandbox="allow-same-origin allow-popups"
      class="w-full pl-2 pr-4 md:ml-4 mr-4 overflow-x-hidden h-min"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { compile2mdStyled } from '~/lib/md';

export default Vue.extend({
  name: 'PreviewBox',

  props: {
    adjustHeight: {
      type: Boolean,
      required: false,
      default: false,
    },

    sideBorder: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  methods: {
    compileWrite (mdCode: string) {
      const code = compile2mdStyled(mdCode);
      const elm = (this.$refs.previewBox!! as HTMLIFrameElement);
      elm.srcdoc = code;

      if (this.adjustHeight === true) {
        this.doAdjustHeight();
      }
    },

    doAdjustHeight () {
      const elm = (this.$refs.previewBox!! as HTMLIFrameElement);
      setTimeout(() => {
        if (elm.contentWindow !== null) {
          elm.style.height = elm.contentWindow.document.body.clientHeight + 100 + 'px';
        }
      }, 100);
    },

    doShrinkHeight () {
      const elm = (this.$refs.previewBox!! as HTMLIFrameElement);
      setTimeout(() => {
        if (elm.contentWindow !== null) {
          elm.style.height = 'calc(100vh - 195px)';
        }
      }, 100);
    },
  },
});

</script>

<style lang="scss">
#previewBox {
  height: calc(100vh - 195px);
  padding-bottom: 30px;
}

</style>
