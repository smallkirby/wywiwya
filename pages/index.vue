<template>
  <layout-wrapper>
    <layout-main-box>
      <div class="flex flex-col mx-2 md:mx-10 pb-8">
        <!-- LOGO -->
        <div class="flex flex-col md:flex justify-center items-center mb-20">
          <img src="~/static/logo/wywiwya.png" class="md:w-32 md:h-32 w-2/3 mr-4">
          <div class="flex flex-col">
            <p class=" text-7xl text-[#8EC07C] font-bold tracking-widest text-center">
              WYWIWYA
            </p>
            <p class="text-center text-2xl text-[#427B58] hidden md:block">
              WHAT YOU WRITE IS WHAT YOU ARE
            </p>
            <div class="text-center text-2xl text-[#427B58] md:hidden">
              <p>WHAT YOU WRITE</p>
              <p>IS</p>
              <p>WHAT YOU ARE</p>
            </div>
          </div>
        </div>

        <!-- WARNING -->
        <div class="px-2">
          <div class="flex flex-col leading-relaxed">
            <div class="text-3xl font-bold mb-4 border-b-2 border-skdark pb-4">
              <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="mr-2" />
              注意
            </div>
            <div class="ml-4">
              <p>現在、<b>WYWIWYA</b>は開発段階です。</p>
              <p>作成したデータは予告なく削除される可能性があります。</p>
              <p>
                開発ステータスについては
                <a
                  href="https://github.com/smallkirby/wywiwya"
                  class="font-bold text-skgreen-light"
                  target="_blank"
                >GitHub</a>
                を参照してください。
              </p>
            </div>
          </div>

          <!-- ABOUT -->
          <div class="flex flex-col leading-relaxed mt-28">
            <div class="text-3xl font-bold mb-4 border-b-2 border-skdark pb-4">
              <font-awesome-icon icon="fa-solid fa-star" class="mr-2" />
              ABOUT
            </div>
            <div class="ml-4">
              準備中です...
            </div>
          </div>

          <!-- PRIVACY -->
          <div class="flex flex-col leading-relaxed mt-28">
            <div class="text-3xl font-bold mb-4 border-b-2 border-skdark pb-4">
              <font-awesome-icon icon="fa-solid fa-book" />
              その他
            </div>
            <div class="ml-4">
              <p>
                <NuxtLink to="/disclaimer" class="text-skgreen-light">
                  免責事項
                </NuxtLink>
              </p>
              <p>
                <NuxtLink to="/privacy" class="text-skgreen-light">
                  プライバシーについて
                </NuxtLink>
              </p>
            </div>
          </div>

          <!-- CONTACT -->
          <div class="flex flex-col leading-relaxed mt-28">
            <div class="text-3xl font-bold mb-4 border-b-2 border-skdark pb-4">
              <font-awesome-icon icon="fa-solid fa-envelope" />
              CONTACT
            </div>
            <div class="ml-4">
              <p>
                質問・お問い合わせ・要望:
                <a href="mailto:wywiwya@gmail.com" class="text-skgreen-light">
                  wywiwya[at]gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </layout-main-box>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';

export const IndexPage = Vue.extend({
  name: 'IndexPage',
});

export default IndexPage;

</script>
