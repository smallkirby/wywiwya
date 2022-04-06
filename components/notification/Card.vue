<template>
  <layout-wrapper>
    <div
      class="flex flex-col border-t-2 border-b-2 rounded-md py-3 px-4 pb-4"
      :class="{
        'border-skgray-dark': isRead === true,
        'border-skwhite-dark': isRead === false,
      }"
    >
      <button class="w-full h-full text-left flex flex-col">
        <div class="flex flex-col md:flex-row justify-between w-full items-center mb-4">
          <div class="text-2xl mb-2">
            {{ notification.title }}
          </div>

          <div class="flex flex-col text-right text-skgray">
            <div>
              作成日: {{ createdAtString }}
            </div>
            <div>
              最終更新: {{ updatedAtString }}
            </div>
          </div>
        </div>

        <div class="mx-2 leading-loose">
          {{ notification.content }}
        </div>
      </button>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import moment from 'moment';
import Vue, { PropType } from 'vue';
import { mapGetters } from 'vuex';
import { Notification } from '~/typings/notification';

export default Vue.extend({
  name: 'NotificationCard',

  props: {
    notification: {
      type: Object as PropType<Notification>,
      required: true,
    },
  },

  computed: {
    createdAtString () {
      // @ts-ignore
      return moment(this.notification.createdAt).format('YYYY年MM月DD日 HH:mm:ss');
    },

    updatedAtString () {
      // @ts-ignore
      return moment(this.notification.updatedAt).format('YYYY年MM月DD日 HH:mm:ss');
    },

    isRead () {
      return this.unreadNotifications.findIndex((cand: Notification) => {
        return cand.id === this.notification.id;
      }) === -1;
    },

    ...mapGetters([
      'unreadNotifications',
    ]),
  },
});
</script>
