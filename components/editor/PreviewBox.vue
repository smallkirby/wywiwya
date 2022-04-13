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
import _ from 'lodash';
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
      const elmUndefinable = this.getIframe();
      if (!elmUndefinable) { return; }
      // compile preview
      const code = compile2mdStyled(mdCode);

      // write compiled and sanitized HTML into src
      const elm = (elmUndefinable as HTMLIFrameElement);
      const contentWindow = elm.contentWindow;
      if (!contentWindow) { return; }
      const currentY = contentWindow.scrollY;
      elm.srcdoc = code;

      // adjust preview height if needed
      if (this.adjustHeight === true) {
        this.doAdjustHeight(elm);
      }

      // scroll to previous Y position when load finishes
      elm.onload = () => {
        elm.contentWindow?.scrollTo(0, currentY);
      };
    },

    doAdjustHeight: _.throttle((preview: HTMLIFrameElement) => {
      setTimeout(() => {
        if (preview && preview.contentWindow) {
          preview.style.height = preview.contentWindow.document.body.clientHeight + 100 + 'px';
        }
      }, 100);
    }, 100),

    doShrinkHeight: _.throttle((preview: HTMLIFrameElement) => {
      setTimeout(() => {
        if (preview && preview.contentWindow) {
          preview.style.height = 'calc(100vh - 195px)';
        }
      }, 100);
    }, 100),

    getIframe (): HTMLIFrameElement | null {
      return this.$refs.previewBox as HTMLIFrameElement | null;
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
