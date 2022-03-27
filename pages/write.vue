<template>
  <layout-wrapper>
    <div class="flex">
      <div class="w-1/2 mt-1 ml-2 mr-1">
        <editor-main-box @mdCodeChange="onCodeChange" />
      </div>
      <div class="w-1/2 ml-1 mr-2 overflow-x-hidden">
        <editor-preview-box ref="previewBox" />
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'WritePage',
  layout: 'full',

  methods: {
    onCodeChange (mdCode: string) {
      (this.$refs.previewBox!! as any).compileWrite(mdCode);
    },
  },
});

</script>
