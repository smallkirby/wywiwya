<template>
  <layout-wrapper>
    <div
      v-if="author!== null"
      class="rounded-xl px-2 md:px-4 border-2 border-skgray-dark hover:border-skwhite-dark
      shadow-2xl pt-4 pb-1 relative"
    >
      <!-- CLICKABLE OVERLAY -->
      <button class="absolute h-full w-full z-50 " @click="onClick" />

      <div class="w-full h-full flex flex-col md:flex-row justify-between items-lfet text-left">
        <!-- LEFT -->
        <div
          class="flex flex-col md:pr-6 pb-4 md:pb-0 pl-2
        border-b-2 md:border-b-0 md:border-r-2 border-skgray-dark whitespace-nowrap mb-2 w-full md:w-auto pr-2"
        >
          <div class="flex">
            <div class="text-xl md:mr-2 mb-2 flex items-center justify-between">
              <div>
                {{ dateString }}
              </div>
            </div>
          </div>
          <div class="flex md:flex-col justify-between w-full">
            <div class="flex items-center">
              <div class="mr-4">
                <img :src="author.photoURL" class="w-8 rounded-full">
              </div>
              <div class="mb-1">
                {{ author.displayName }}
              </div>
            </div>
            <div class="text-skgray mt-2 text-sm flex-col flex">
              <div>
                最終更新:
              </div>
              <div class="ml-2">
                {{ lastUpdateString }}
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="w-full h-full flex flex-col md:mx-4 pt-4 md:pt-0">
          <div class="ml-4 overflow-hidden h-full text-ellipsis pb-0">
            <iframe
              ref="badgeDiaryContent"
              sandbox="allow-same-origin allow-popups"
              class="w-full h-[9.0rem] overflow-hidden sandboxedPreview"
            />
          </div>
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapGetters } from 'vuex';
import { Diary } from '~/typings/diary';
import { User } from '~/store/state';
import { did2string } from '~/lib/util/diary';
import { fetchUser } from '~/lib/user';
import { serverTimestamp2moment } from '~/lib/util/date';
import { compile2mdStyled } from '~/lib/md';

export default Vue.extend({
  name: 'DiaryBadge',

  props: {
    diary: {
      type: Object as PropType<Diary>,
      required: true,
    },
  },

  data () {
    return {
      author: null as User | null,
      content: '',
    };
  },

  computed: {
    dateString () {
      return did2string(this.diary.dateID);
    },

    lastUpdateString () {
      return serverTimestamp2moment(this.diary.lastUpdatedAt as any).format('YYYY年MM月DD日 HH:mm');
    },

    ...mapGetters([
      'me',
    ]),
  },

  async created () {
    // @ts-ignore
    const user = await fetchUser(this.diary.author);
    // @ts-ignore
    this.author = user;
  },

  mounted () {
    const interval = setInterval(() => {
      // @ts-ignore
      if (this.$refs.badgeDiaryContent) {
        // @ts-ignore
        let html = compile2mdStyled(this.diary.contentMd);
        html = html + `
          <style>
            body {
              line-height: 1;
              overflow: hidden;
              margin-right: 0 !important;
            }
            p {
              margin-bottom: 0.2rem !important;
              padding-left: 0.2rem !important;
            }
            .blurFilter {
              position: absolute;
              filter: blur(4px);
              top: 7.4rem;
              width: 100%;
              height: 100%;
              margin-left: 0;
              padding-left: 0;
              z-index: 99;
              background-color: #130F1A !important;
              opacity: 0.8;
            }
          </style>
          <div class="blurFilter" />
        `;
        // @ts-ignore
        this.$refs.badgeDiaryContent.srcdoc = html;
        clearInterval(interval);
      }
    }, 500);
  },

  methods: {
    onClick () {
      if (this.me && this.me.uid === this.diary.author) {
        this.$router.push(`/edit/${this.diary.id}`);
      } else {
        this.$router.push(`/view/${this.diary.id}`);
      }
    },
  },
});
</script>
