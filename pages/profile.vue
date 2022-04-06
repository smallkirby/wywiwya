<template>
  <layout-wrapper>
    <layout-main-box>
      <vue-loading v-if="me === null" />

      <div v-else class="flex flex-col mx-4">
        <div class="mx-2 md:mx-12 mb-12">
          <user-badge :user="me" />
        </div>

        <div>
          <user-kusa class="mb-12" :user="me" />
        </div>

        <div>
          <user-setting :me="me" class="mb-12" />
        </div>
      </div>
    </layout-main-box>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'ProfilePage',

  computed: {
    ...mapGetters([
      'me',
    ]),
  },

  mounted () {
    if (this.me === null) {
      this.$router.push('/login');
    }
  },
});

</script>
