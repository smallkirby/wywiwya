<template>
  <layout-main-box>
    <div class="flex flex-col text-center">
      <div class="flex justify-center items-center mb-10">
        <font-awesome-icon icon="fa-solid fa-face-dizzy" class="text-3xl" />
        <p class="text-3xl font-bold mx-4">
          {{ title }}
        </p>
        <font-awesome-icon icon="fa-solid fa-face-dizzy" class="text-3xl" />
      </div>

      <div>
        <div v-if="error.statusCode === 404" class="text-center leading-loose">
          <p>お探しのページは見つかりませんでした。</p>
          <p>URLが正しいか確認してください。</p>
        </div>

        <div v-else class="text-center leading-loose">
          <p>なんらかのエラーが発生しました。</p>
          <p>再度時間をおいてからページをリロードしてください。</p>
          <p>もしくは、管理者に連絡を取ってください。</p>
        </div>
      </div>
    </div>
  </layout-main-box>
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
  name: 'ErrorPage',

  props: {
    error: {
      type: Object,
      required: true,
    },
  },

  computed: {
    title () {
      if (this.error.statusCode === 404) {
        return 'PAGE NOT FOUND';
      } else {
        return 'UNKNOWN ERROR';
      }
    },
  },
});
</script>
