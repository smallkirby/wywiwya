<template>
  <layout-wrapper>
    <layout-main-box>
      <div class="flex flex-col leading-loose mx-2">
        <div class="text-3xl mx-auto mb-8">
          <font-awesome-icon icon="fa-solid fa-key" />
          プライバシー・セキュリティについて
        </div>

        <div class="mx-2 md:mx-8 text-left mb-2">
          <div class="mb-8 leading-loose">
            <p>
              このページでは、
              <span class="font-bold">WYWIWYA: WAHT YOU WRITE IS WHAT YOU ARE</span>
              (以下、本サイト)におけるプライバシー情報の取り扱いに関して説明します。
              なお、免責事項については<NuxtLink to="/disclaimer" class="text-skgreen-light">
                こちら
              </NuxtLink>
              を参照してください。
              以下の全ての文章は意図する設計上の話であり、サイト実装上の過失により実際とは異なる可能性もあります。
            </p>
          </div>

          <div class="mt-16">
            <div class="text-2xl border-b-2 border-skdark pb-2 mb-4">
              <font-awesome-icon icon="fa-solid fa-bag-shopping" />
              サイトが利用する情報
            </div>
            <div class="md:mx-4">
              本サイトでは、サイトの品質の向上のためにGoogleアナリティクスを利用しています。
              GoogleアナリティクスはCookiesを利用して、ページ滞在時間等のユーザ情報を収集します。
              詳細は
              <a href="https://www.google.com/intl/ja/policies/privacy/partners/" class="text-skgreen-light">こちら</a>
              をご確認ください。
            </div>
          </div>

          <div class="mt-16">
            <div class="text-2xl border-b-2 border-skdark pb-2 mb-4">
              <font-awesome-icon icon="fa-solid fa-arrow-right-to-bracket" />
              ログイン情報について
            </div>
            <div class="md:mx-4">
              <p>本サイトでは、ユーザ認証のために <a href="https://github.com" class="text-skgreen-light">GitHub</a> を利用しています。</p>
              <p>サインアップ・ログインに関して、本サイトはユーザのGitHubの以下の情報を利用します:</p>
              <ul class="list-decimal ml-8 mb-2">
                <li>GitHub上の表示名</li>
                <li>GitHubプロフィールにおける画像URL</li>
              </ul>
              <p>以上の情報は、全てのGitHubアカウントにおいて本来公開されているものです。</p>
              <p>
                本サイトには、GitHubアカウントにおけるリポジトリの読み込み・書き込み権限を一切与えられません。
                詳細は、ログイン時に表示されるOAuth画面をご確認ください。
              </p>
            </div>
          </div>

          <div class="mt-16">
            <div class="text-2xl border-b-2 border-skdark pb-2 mb-4">
              <font-awesome-icon icon="fa-solid fa-earth-americas" />
              ユーザデータの公開について
            </div>
            <div class="md:mx-4">
              <p>
                本サイトにおいて作成されたデータは、
                <a href="https://firebase.google.com/docs/firestore" class="text-skgreen-light">Cloud Firestore</a>
                に平文で保存されます。
              </p>
              <p>
                保存される情報は、以下を含みます:
                <ul class="list-decimal ml-8 mb-2">
                  <li>ユーザのログイン情報(表示名・画像URL・作成日)</li>
                  <li>作成した全てのDiary</li>
                </ul>
              </p>
              <p>
                作成されたデータへのアクセスは、ユーザの認証状態によって制御されます。
              </p>
              <p>
                以下の情報は、非ログインユーザを含む全てのユーザに公開されます:
                <ul class="list-decimal ml-8 mb-2">
                  <li>ユーザのログイン情報(表示名・画像URL・作成日等)</li>
                  <li>作成したDiaryの内、<b>公開</b>状態に設定されているもの</li>
                  <li>作成したDiaryの個数(非公開のものを含む)</li>
                </ul>
              </p>
              <p>
                以下の情報は、他のユーザには公開されません:
                <ul class="list-decimal ml-8 mb-2">
                  <li>作成したDiaryの内、<b>非公開状態</b>に設定されているもの</li>
                </ul>
              </p>
            </div>
          </div>

          <div class="mt-16">
            <div class="text-2xl border-b-2 border-skdark pb-2 mb-4">
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
              Algoliaとの連携について
            </div>
            <div class="md:mx-4">
              <p class="mt-4">
                また、ユーザ名の部分文字列検索のために
                <a href="https://www.algolia.com/" class="text-skgreen-light">Algolia</a>
                を利用しています。
              </p>
              <p>
                Algoliaには、ユーザ情報の内以下の情報だけを登録しています:
                <ul class="list-decimal ml-8 mb-2">
                  <li>WYWIWYAにおけるユーザID</li>
                  <li>WYWIWYAにおける表示名</li>
                </ul>
              </p>
              <p>
                なお、Algoliaの検索にはAPIキーが必要であり、このAPIキーはWYWIWYAのシークレットとして秘匿されているため、
                第三者が直接Algolia APIを呼び出して検索することはできないようになっています。
              </p>
              <p>
                また、現在のところAlgoliaのユーザがAlgolia APIを使って検索できる回数は、一日あたり30回に制限されています。
              </p>
            </div>
          </div>

          <div class="mt-16">
            <div class="text-2xl border-b-2 border-skdark pb-2 mb-4">
              <font-awesome-icon icon="fa-solid fa-house" />
              ユーザデータの取り扱いについて
            </div>
            <div class="md:mx-4">
              <p>ユーザが作成したデータは、ユーザへの予告なく削除される可能性があります。</p>
              <p>勿論そうならないように努力はしますが、データベース容量やデータ構造の変化によってやむを得ない場合にはデータが削除される可能性があります。</p>
            </div>
          </div>

          <div class="mt-16">
            <div class="text-2xl border-b-2 border-skdark pb-2 mb-4">
              <font-awesome-icon icon="fa-solid fa-shield-halved" />
              セキュリティについて
            </div>
            <div class="md:mx-4">
              <p>本サイトではユーザの作成した情報の保護・及びブラウザを介した種々の攻撃に対するセキュリティリスクを軽減するための対策を講じています。</p>
              <p>
                詳細については
                <a href="https://github.com/smallkirby/wywiwya/blob/master/memo/SECURITY.md" class="text-skgreen-light">
                  GitHub
                </a>
                をご覧ください。
              </p>
              <p>
                可能な限りのセキュリティ対策・プライバシー保護を講じていますが、
                <NuxtLink to="/disclaimer" class="text-skgreen-light">
                  免責事項
                </NuxtLink>
                に定める通り本サイトは如何なる損失に対する責任も負いません。
              </p>
              <p>
                重大な秘匿情報については、本サイトに書き込まないことを強く推奨します。
              </p>
            </div>
          </div>

          <div class="mt-20">
            お問い合わせ先:
            <a href="mailto:wywiwya+privacy@gmail.com" class="text-skgreen-light">wywiwya+privacy[at]gmail.com</a>
          </div>

          <div class="mt-20 text-right flex flex-col">
            <div>
              2022年04月07日 WYWIWYA
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
  name: 'PrivacyPage',
});

export default IndexPage;

</script>
