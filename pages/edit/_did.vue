<template>
  <layout-wrapper>
    <vue-loading v-show="isLoading" class="pt-20" />
    <editor-integrated v-if="!isLoading && diary !== null" :diary="diary" />

    <layout-main-box v-if="!isLoading && diary === null">
      <div class="flex flex-col mt-4">
        <div class="text-center text-2xl">
          <font-awesome-icon icon="fa-solid fa-circle-xmark" />
          Diaryが見つかりませんでした
          <font-awesome-icon icon="fa-solid fa-circle-xmark" />
        </div>

        <div class="text-center mt-12 leading-loose">
          <div>
            ID:<span class="italic underline">{{ did }}</span> のDiaryは見つかりませんでした。
          </div>
          <div>
            Diaryが存在していないか、編集する権限を持っていない可能性があります。
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
  name: 'EditPage',
  layout: 'full',

  data () {
    return {
      diary: null as Diary | null,
      isLoading: true,
    };
  },

  computed: {
    did () {
      return this.$route.params.did;
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
        this.changeLayout();
      }
    },
  },

  created () {
    if (this.$route.params.did === undefined) {
      this.$router.push('/');
    }
  },

  async mounted () {
    // @ts-ignore
    if (this.me !== null && this.isLoading) {
      // @ts-ignore
      this.diary = await this.getDiary();
      // @ts-ignore
      this.changeLayout();
      // @ts-ignore
      this.isLoading = false;
    }
  },

  methods: {
    async getDiary () {
      if (this.me === null) { return null; }
      return await fetchDiaryById(this.me.uid, this.$route.params.did);
    },

    changeLayout () {
      // @ts-ignore
      if (this.diary === null) {
        // @ts-ignore
        $nuxt.setLayout('default');
      } else {
        // @ts-ignore
        $nuxt.setLayout('full');
      }
    },
  },
});

</script>
