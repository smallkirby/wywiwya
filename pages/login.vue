<template>
  <layout-wrapper>
    <div class="w-96 mx-auto">
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
