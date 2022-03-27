<template>
  <layout-wrapper>
    <vue-loading v-show="isLoading" class="pt-20" />
    <editor-integrated v-if="!isLoading && diary !== null" />

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
import { fetchDiary } from '~/lib/diary';
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
      if (this.me !== null && this.isLoading) {
        this.diary = await this.getDiary();
        this.isLoading = false;
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
    if (this.me !== null && this.isLoading) {
      this.diary = await this.getDiary();
      this.isLoading = false;
      this.changeLayout();
    }
  },

  methods: {
    async getDiary () {
      if (this.me === null) { return null; }
      return await fetchDiary(this.me.uid, this.$route.params.did);
    },

    changeLayout () {
      if (this.diary === null) {
        $nuxt.setLayout('default');
      } else {
        $nuxt.setLayout('full');
      }
    },
  },
});

</script>
