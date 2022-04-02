<template>
  <layout-wrapper>
    <vue-loading v-show="isLoading" class="pt-20" />
    <div v-if="!isLoading && diary !== null" :diary="diary">
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
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { fetchDiaryById } from '~/lib/diary';
import { Diary } from '~/typings/diary';

export default Vue.extend({
  name: 'ViewPage',

  data () {
    return {
      diary: null as Diary | null,
      isLoading: true,
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
        this.diary = await this.getDiary();
        // @ts-ignore
        this.isLoading = false;
        // @ts-ignore
        this.setText();
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
    if (this.me !== null && this.isLoading) {
      // @ts-ignore
      this.diary = await this.getDiary();
      // @ts-ignore
      this.isLoading = false;
      // @ts-ignore
      this.setText();
    }
  },

  methods: {
    async getDiary () {
      if (!this.id) { return null; }
      return await fetchDiaryById(this.me.uid, this.id as string);
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
