<template>
  <layout-wrapper>
    <layout-main-box>
      <div class="flex flex-col mx-2">
        <div class="text-3xl mx-auto mb-8">
          <font-awesome-icon icon="fa-solid fa-scale-balanced" />
          免責事項
        </div>

        <div class="mx-2 md:mx-8 text-left mb-2">
          <div class="mb-8">
            以下の文章において、<span class="font-bold">WYWIWYA: WAHT YOU WRITE IS WHAT YOU ARE</span> (以下、本サイト)における免責事項を定めます。
          </div>

          <div class="md:mx-12 ml-8 mr-2 mt-2">
            <ul class="list-decimal leading-loose">
              <li>
                <p class="underline">
                  本サイトは、本サイトを利用したことによって生じた如何なる損害・損失等に対して一切の責任を負いません。
                </p>
              </li>
              <li>
                ソフトウェアとしての本サイトは MIT LICENSE で公開されています。詳細については
                <a href="https://github.com/smallkirby/wywiwya" class="text-skgreen-light">GitHub</a> を参照してください。
              </li>
              <li>
                本サイトで利用しているアイコン・画像等は、各引用元の利用規約に則って利用されています。
                もし著作権を侵害していると思われるリソースを発見した場合には、管理者までご連絡ください。迅速に対応します。
              </li>
              <li>
                本サイトは、品質向上のためにGoogleアナリティクスを利用しています。Googleによるデータ利用に関しての詳細は
                <a href="https://www.google.com/intl/ja/policies/privacy/partners/" class="text-skgreen-light">こちら</a>
                をご覧ください。
              </li>
              <li>
                本サイトにおいて作成された全てのユーザデータは、予告なく削除される可能性があります。
              </li>
              <li>
                本サイトの利用者は、本サイトの利用によって本免責事項の全てに同意したものと見なします。
              </li>
            </ul>
          </div>

          <div class="mt-20">
            なお、本サイトが利用する情報に関しての詳細は <NuxtLink to="privacy" href="" class="text-skgreen-light">
              こちら
            </NuxtLink> をご覧ください。
          </div>

          <div class="mt-10">
            お問い合わせ先: <a href="mailto:wywiwya+legal@gmail.com" class="text-skgreen-light">wywiwya+legal[at]gmail.com</a>
          </div>

          <div class="mt-20 text-right flex flex-col">
            <div>
              2022年04月04日 WYWIWYA
            </div>
            <div>
              version 0.0.1
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
  name: 'DisclaimerPage',
});

export default IndexPage;

</script>
