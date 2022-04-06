<template>
  <layout-wrapper>
    <nuxt-link class="" to="/notification">
      <div
        v-tooltip="unreadNotifications.length === 0 ? '' : `${unreadNotifications.length} 件の未読のお知らせがあります`"
        class="shadow-xl mt-4 py-2 px-3 mx-2 flex flex-col hover:bg-skwhite-dark hover:text-skdark rounded-full"
        :class="{
          'bg-skwhite-dark': unreadNotifications.length !== 0,
          'text-skdark': unreadNotifications.length !== 0,
        }"
      >
        <font-awesome-icon icon="fa-solid fa-bell" />
      </div>
    </nuxt-link>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'NotificationBadge',

  computed: {
    ...mapGetters([
      'unreadNotifications',
    ]),
  },

  methods: {
  },
});
</script>
