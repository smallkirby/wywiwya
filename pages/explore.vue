<template>
  <layout-wrapper>
    <layout-main-box>
      <misc-dialog
        v-show="dialogShowing"
        :config="failDialogConfig"
        @failAlertOk="dialogShowing = false"
      >
        <div class="flex flex-col">
          <div>
            ユーザの検索に失敗しました。
          </div>
          <div>
            {{ errMsg }}
          </div>
        </div>
      </misc-dialog>

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
import { getAllUsers, searchUserPartialMatch } from '~/lib/user';
import { ConfirmDialog } from '~/components/misc/Dialog.vue';

const FailDialogConfig: ConfirmDialog = {
  typ: 'confirm',
  title: 'ユーザの検索に失敗しました',
  closeText: 'OK',
  closeEmission: 'failAlertOk',
};

export default Vue.extend({
  name: 'ExplorePage',

  data () {
    return {
      resultUsers: null as User[] | null,
      isSearching: false,
      failDialogConfig: FailDialogConfig,
      dialogShowing: false,
      errMsg: '',
    };
  },

  methods: {
    async onSearchRequest (searchStr: string) {
      this.isSearching = true;

      const result = searchStr.length === 0
        ? await getAllUsers()
        : await searchUserPartialMatch(searchStr);
      if (typeof result === 'string') {
        // eslint-disable-next-line no-console
        console.error('Failed to search users: ', result);
        this.errMsg = result;
        this.dialogShowing = true;
      } else {
        // @ts-ignore
        this.resultUsers = result;
      }

      this.isSearching = false;
    },
  },
});

</script>
