<template>
  <layout-wrapper>
    <div class="w-full md:w-96 mr-3 px-3 md:mx-auto">
      <login-box />
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';

// TODO: goto home when already logged in

export default Vue.extend({
  name: 'LoginPage',
});

</script>
