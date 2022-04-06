<template>
  <layout-wrapper>
    <layout-main-box>
      <div class="flex flex-col mt-2 mx-2 md:mx-10">
        <div class="text-3xl font-bold mb-4 ml-2">
          <font-awesome-icon icon="fa-solid fa-bell" />
          お知らせ
        </div>

        <div class="mb-12 ml-4">
          既読にするにはクリックしてください。
        </div>

        <div v-if="notifications !== null">
          <div v-for="(notif, ix) in notifications" :key="ix" class="mb-8">
            <notification-card :notification="notif" />
          </div>
        </div>
      </div>
    </layout-main-box>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export const NotificationPage = Vue.extend({
  name: 'NotificationPage',

  computed: {
    ...mapGetters([
      'notifications',
    ]),
  },
});

export default NotificationPage;

</script>
