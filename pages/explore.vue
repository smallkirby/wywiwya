<template>
  <layout-wrapper>
    <layout-main-box>
      <div class="flex flex-col mt-2 mx-2 md:mx-10">
        <div class="text-3xl font-bold">
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
          ユーザを検索する
        </div>
        <div>
          <user-search-box class="mt-6" @requestSearch="onSearchRequest" />
        </div>

        <vue-loading v-if="isSearching" class="mt-24" />
        <div v-if="!isSearching && resultUsers !== null" class="mt-8 mb-8">
          <div v-for="(user, ix) in resultUsers" :key="ix" class="mt-8">
            <user-badge :user="user" />
          </div>
          <div v-if="resultUsers.length === 0" class="text-center">
            該当するユーザが見つかりませんでした
          </div>
        </div>
      </div>
    </layout-main-box>
  </layout-wrapper>
</template>

<script lang="ts">
import { User } from '@firebase/auth';
import Vue from 'vue';
import { getAllUsers, searchUserFullMatch } from '~/lib/user';

export default Vue.extend({
  name: 'ExplorePage',

  data () {
    return {
      resultUsers: null as User[] | null,
      isSearching: false,
    };
  },

  methods: {
    async onSearchRequest (searchStr: string) {
      this.isSearching = true;

      const result = searchStr.length === 0
        ? await getAllUsers()
        : await searchUserFullMatch(searchStr);
      if (typeof result === 'string') {
        // eslint-disable-next-line no-console
        console.error('Failed to search users: ', result);
      } else {
        // @ts-ignore
        this.resultUsers = result;
      }

      this.isSearching = false;
    },
  },
});

</script>
