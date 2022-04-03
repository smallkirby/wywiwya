<template>
  <layout-wrapper>
    <layout-main-box class="px-2 md:px-12">
      <vue-loading v-if="isLoading" class="pt-20" />

      <div v-if="!isLoading && user === null" class="flex flex-col mt-4">
        <div class="text-center text-2xl">
          <font-awesome-icon icon="fa-solid fa-circle-xmark" />
          ユーザが見つかりませんでした
          <font-awesome-icon icon="fa-solid fa-circle-xmark" />
        </div>

        <div class="text-center mt-12 leading-loose">
          <div>
            ID:<span class="italic underline">{{ uid }}</span> のユーザは見つかりませんでした。
          </div>
          <div>
            ユーザが存在していないか、閲覧する権限を持っていない可能性があります。
          </div>
          <div>
            それかバグです。知らんけど。
          </div>
        </div>
      </div>

      <div v-if="!isLoading && user !== null" class="flex flex-col">
        <user-badge :user="user" class="mb-8" />

        <div class="text-center md:text-left mb-8">
          Diaries: <span class="font-bold">
            {{ user.diaries.length }}
          </span> 件 (非公開のものを含みます)
        </div>

        <div class="md:px-4">
          <div v-if="diaries.length !== 0">
            <div v-for="(diary, ix) in diaries" :key="ix" class="mb-4">
              <diary-badge :diary="diary" />
            </div>
          </div>
          <div v-else>
            公開しているDiaryはありません。
          </div>
        </div>
      </div>
    </layout-main-box>
  </layout-wrapper>
</template>

<script lang="ts">
import { User } from '@firebase/auth';
import Vue from 'vue';
import { fetchOthersPublicDiaries } from '~/lib/diary';
import { fetchUser } from '~/lib/user';
import { Diary } from '~/typings/diary';

export default Vue.extend({
  name: 'UsersPage',

  data () {
    return {
      isLoading: true,
      user: null as User | null,
      uid: '',
      diaries: [] as Diary[],
    };
  },

  async mounted () {
    this.uid = this.$route.params.uid;

    const user = await fetchUser(this.uid);
    if (user === null) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch user...');
      this.user = null;
      this.isLoading = false;
    } else {
      // @ts-ignore
      this.user = user;
      this.isLoading = false;
    }

    this.diaries = await fetchOthersPublicDiaries(this.uid);
  },
});

</script>
