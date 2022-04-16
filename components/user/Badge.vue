<template>
  <layout-wrapper>
    <button class="w-full" @click="onClicked">
      <div
        class="bg-skdark rounded-xl shadow-xl h-13 mt-4 py-2 px-6
        border-t-2 border-b-2 border-skgray hover:border-skwhite-dark
        flex flex-col"
      >
        <div class="flex items-center">
          <div class="mr-5 md:mr-10 my-2">
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
          <div class="flex flex-col w-full text-left">
            <div class="text-2xl font-bold mb-2">
              {{ user.displayName }}
            </div>

            <div class="flex flex-col md:ml-4 leading-loose text-skgray">
              <div class="flex flex-col md:flex-row">
                <div>利用開始日:</div>
                <div class="ml-4">
                  {{ startDateString }}
                </div>
              </div>
              <div class="flex flex-col md:flex-row">
                <div>書いたDiaryの数:</div>
                <div class="ml-4">
                  {{ user.diaries.length }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapGetters } from 'vuex';
import { convert2moment } from '~/lib/util/date';
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
      const moment = convert2moment(this.user.createdAt);
      return moment !== null ? moment.format('YYYY年MM月DD日') : '(unknown)';
    },

    ...mapGetters([
      'me',
    ]),
  },

  methods: {
    onClicked () {
      if (this.me !== null && this.user.uid === this.me.uid) {
        this.$router.push('/history');
      } else {
        this.$router.push(`/users/${this.user.uid}`);
      }
    },
  },
});
</script>
