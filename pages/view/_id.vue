<template>
  <layout-wrapper>
    <vue-loading v-show="isLoading" class="pt-20" />
    <div v-if="!isLoading && diary !== null" :diary="diary">
      <div v-if="author !== null" class="">
        <user-badge :user="author" />
      </div>
      <editor-preview-box ref="previewBox" />
    </div>

    <layout-main-box v-if="!isLoading && diary === null">
      <div class="flex flex-col mt-4">
        <div class="text-center text-2xl">
          <font-awesome-icon icon="fa-solid fa-circle-xmark" />
          Diaryが見つかりませんでした
          <font-awesome-icon icon="fa-solid fa-circle-xmark" />
        </div>

        <div class="text-center mt-12 leading-loose">
          <div>
            ID:<span class="italic underline">{{ id }}</span> のDiaryは見つかりませんでした。
          </div>
          <div>
            Diaryが存在していないか、閲覧する権限を持っていない可能性があります。
          </div>
          <div>
            それかバグです。知らんけど。
          </div>
        </div>
      </div>
    </layout-main-box>
  </layout-wrapper>
</template>

<script lang="ts">
import { User } from '@firebase/auth';
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { fetchDiaryById } from '~/lib/diary';
import { fetchUser } from '~/lib/user';
import { Diary } from '~/typings/diary';

export default Vue.extend({
  name: 'ViewPage',

  data () {
    return {
      diary: null as Diary | null,
      isLoading: true,
      author: null as User | null,
    };
  },

  computed: {
    id () {
      return this.$route.params.id;
    },
    ...mapGetters([
      'me',
    ]),
  },

  watch: {
    async me () {
      // @ts-ignore
      if (this.me !== null && this.isLoading) {
        // @ts-ignore
        await this.prepareDiary();
      }
    },
  },

  created () {
    if (!this.$route.params.id) {
      this.$router.push('/');
    }
  },

  async mounted () {
    // @ts-ignore
    await this.prepareDiary();
  },

  methods: {
    async prepareDiary () {
      // @ts-ignore
      this.diary = await this.getDiary();
      // @ts-ignore
      this.isLoading = false;
      // @ts-ignore
      this.setText();
    },

    async getDiary () {
      if (!this.id) { return null; }
      const uid = this.me == null ? null : this.me.uid as string;
      const diary = await fetchDiaryById(uid, this.id as string);
      if (diary !== null && diary.author !== uid) {
        // @ts-ignore
        this.author = await fetchUser(diary.author);
      }
      return diary;
    },

    setText () {
      const interval = setInterval(() => {
        if (this.$refs.previewBox) {
          // @ts-ignore
          (this.$refs.previewBox!! as any).compileWrite(this.diary.contentMd);
          clearInterval(interval);
        }
      }, 500);
    },
  },
});

</script>
