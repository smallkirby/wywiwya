<template>
  <layout-wrapper>
    <div>
      <button @click="doLogin()">
        <p>login</p>
      </button>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { Login } from '@/lib/auth';

export default Vue.extend({
  name: 'LoginPage',
  methods: {
    async doLogin () {
      await Login();
    },
  },
});

</script>
