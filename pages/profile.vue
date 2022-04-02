<template>
  <layout-wrapper>
    <layout-main-box>
      <div>
        <p>profile</p>
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
    setTimeout(() => {
      if (this.me === null) {
        this.$router.push('/login');
      }
    }, 500);
  },
});

</script>
