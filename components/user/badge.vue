<template>
  <layout-wrapper>
    <div
      class="bg-skdark rounded-xl shadow-xl h-13 mt-4 py-2 px-6
    border-t-2 border-b-2 border-skgray
    flex flex-col"
    >
      <div class="flex items-center">
        <div class="mr-10 my-2">
          <img
            v-if="photoUrlValid"
            :src="user.photoURL"
            class="rounded-full w-28"
            @error="photoUrlValid = !photoUrlValid"
          >
          <button v-else>
            <font-awesome-icon icon="fa-solid fa-question" class="rounded-full w-28 text-4xl" />
          </button>
        </div>
        <div class="flex flex-col w-full">
          <div class="text-2xl font-bold mb-2">
            {{ user.displayName }}
          </div>

          <div class="flex flex-col ml-4 leading-loose">
            <div>
              利用開始日: {{ startDateString }}
            </div>
            <div>
              書いたDiaryの数: {{ user.diaries.length }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import { FieldValue } from '@firebase/firestore';
import Vue, { PropType } from 'vue';
import { serverTimestamp2string } from '~/lib/util/date';
import { User } from '~/store/state';

export default Vue.extend({
  name: 'MeBadge',

  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },

  data () {
    return {
      photoUrlValid: true,
    };
  },

  computed: {
    startDateString () {
      return serverTimestamp2string(this.user.createdAt as FieldValue);
    },
  },
});
</script>
