<template>
  <layout-wrapper>
    <div>
      <p>index</p>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';

export const IndexPage = Vue.extend({
  name: 'IndexPage',

  mounted () {
    // eslint-disable-next-line no-console
    console.log(this.$config.FB_PROJECTID);
  },
});

export default IndexPage;

</script>
