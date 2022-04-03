<template>
  <layout-wrapper>
    <footer
      class="w-full bg-black text-white px-4 flex flex-col md:flex-row items-start md:items-center justify-between"
    >
      <!-- Logo for PC -->
      <div class="flex-col ml-4 mt-2 hidden md:flex">
        <div class="flex items-center">
          <img src="~/static/logo/wywiwya.png" class="w-16 h-16 mr-4">
          <p class="text-3xl">
            WYWIWYA
          </p>
        </div>

        <div class="bottom-0 mt-2 mb-4 text-gray-400">
          2022 smallkirby. Few Rights Reserved.
        </div>
      </div>

      <div class="flex flex-col md:flex-row mt-2 md:mt-0 ml-3 md:mx-12">
        <!-- Nirugiri -->
        <div class="flex flex-col text-gray-300 md:mx-12 mb-4 md:mb-2">
          <div class="text-lg mb-1">
            <p>Nirugiri</p>
          </div>
          <div class="text-gray-400 flex flex-col">
            <div class="mb-1">
              <a href="https://nirugiri.smallkirby.xyz" class="flex" target="_blank">
                <img src="~/static/3rd/youtube/yt_logo_rgb_light.png" class="h-5 mx-2">
              </a>
            </div>
          </div>
        </div>

        <!-- Legal -->
        <div class="flex flex-col text-gray-300 md:mx-12 mb-4 md:mb-2">
          <div class="text-lg mb-1">
            <p>Legal</p>
          </div>
          <div class="text-gray-400 flex flex-col ml-3 md:ml-0">
            <div>
              <nuxt-link to="/privacy">
                Privacy
              </nuxt-link>
            </div>
            <div>
              <nuxt-link to="/disclaimer">
                Disclaimer
              </nuxt-link>
            </div>
          </div>
        </div>

        <!-- Follow us -->
        <div class="flex flex-col text-gray-300 md:mx-12 mb-4 md:mb-2">
          <div class="text-lg mb-1">
            <p>Follow Us</p>
          </div>
          <div class="text-gray-400 ml-3 md:ml-0">
            <div class="mb-1">
              <a href="https://github.com/smallkirby/wywiwya" class="flex" target="_blank">
                <img src="~/static/3rd/github/GitHub-Mark-Light-32px.png" class="w-5 h-5 mx-2">
                <p>Github Repository</p>
              </a>
            </div>
            <div class="mb-1">
              <a href="https://twitter.com/smallkirby" class="flex" target="_blank">
                <img src="~/static/3rd/twitter/2021-Twitter-logo-blue.png" class="w-5 h-5 mx-2">
                <p>Twitter</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Logo for mobiles -->
      <div class="flex-col mx-auto mt-2 flex md:hidden">
        <div class="flex items-center mx-auto">
          <img src="~/static/logo/wywiwya.png" class="w-16 h-16 mr-4">
          <p class="text-3xl">
            WYWIWYA
          </p>
        </div>

        <div class="bottom-0 mt-2 mb-4 text-gray-400">
          2022 smallkirby. Few Rights Reserved.
        </div>
      </div>
    </footer>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LayoutFooter',
});
</script>
