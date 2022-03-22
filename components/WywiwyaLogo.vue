<template>
  <layout-wrapper>
    <button>
      <nuxt-link to="/">
        <div class="flex mx-2 items-center hover:bg-skwhite-dark rounded-md">
          <div class="text-6xl mr-2">
            WYWIWYA
          </div>
          <div class="flex-col">
            <div class="text-xs text-center leading-none">
              WHAT YOU WRITE
            </div>
            <div class="text-xs text-center leading-none">
              is
            </div>
            <div class="text-xs text-center leading-none">
              WHAT YOU ARE
            </div>
          </div>
        </div>
      </nuxt-link>
    </button>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'WywiwyaLogo',
});
</script>
