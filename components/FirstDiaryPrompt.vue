<template>
  <layout-wrapper>
    <div
      class="bg-white rounded-xl px-4 py-3 border-2 border-skdark-light shadow-2xl
        flex flex-col justify-between items-center"
    >
      <div class="text-lg md:text-xl mb-4 text-center pb-4 border-b-2 md:w-2/3">
        <p>📝 最初のDiaryを書きましょう 📝</p>
      </div>

      <div class="mb-4 border-b-2 pb-4 md:w-2/3">
        <ul class="min-w-max text-center">
          <li>❤️ その日に考えたことを書き留める</li>
          <li>🧠 過去の日記を振り返る</li>
          <li>🔖 今までの記憶を簡単に整理整頓</li>
        </ul>
      </div>

      <div class="mb-4">
        <button class="bg-skgreen-light hover:bg-skgreen-dark py-2 px-4 rounded-xl shadow-2xl">
          <div>
            <nuxt-link to="/write">
              📝 WRITE NOW
            </nuxt-link>
          </div>
        </button>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FirstDiaryPrompt',
});
</script>
