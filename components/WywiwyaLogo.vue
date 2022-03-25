<template>
  <layout-wrapper>
    <button>
      <nuxt-link to="/">
        <div class="flex mx-2 items-center hover:bg-skwhite-dark rounded-md">
          <div class="text-6xl mr-2">
            WYWIWYA
          </div>
          <img src="~/static/logo/wywiwya.png" class="w-10 md:hidden">
          <div class="flex-col hidden md:block">
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
        <div class="md:hidden">
          What You Write Is What You Are
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
