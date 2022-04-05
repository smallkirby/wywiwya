<template>
  <layout-wrapper>
    <div class="px-2 flex flex-col md:flex-row items-center justify-center">
      <div
        class="text-lg font-bold pr-4 border-b-2
        md:border-b-0 md:border-r-2  border-skgray pb-1 md:pb-0 px-2 mb-1 md:mb-0"
      >
        {{ dateString }}
      </div>

      <div class="flex ml-2">
        <!-- SAVE BOX -->
        <div class="m-1 border-2 border-skdark hover:border-skdark-light rounded-md h-full px-2">
          <div v-show="isSaving" class="w-14 h-6">
            <vue-loading :size="{width: '20px', height: '12px'}" type="beat" />
          </div>
          <button
            v-show="!isSaving && !isShowingSuccessSave"
            v-tooltip="'変更を保存する'"
            class="w-full h-full"
            @click="doSave"
          >
            <font-awesome-icon icon="fa-solid fa-floppy-disk" />
          </button>
          <button v-show="isShowingSuccessSave" v-tooltip="'保存しました'" class="w-full h-full mr-2 text-green-400">
            <font-awesome-icon icon="fa-solid fa-circle-check" />
          </button>
        </div>

        <!-- MARK PUBLIC BOX -->
        <div class="m-1 w-8 h-full">
          <div class="border-2 border-skdark hover:border-skdark-light rounded-md px-1">
            <button class="w-full h-full" @click="onPublicChange(!isPublicNow)">
              <font-awesome-icon
                v-if="!isPublicNow"
                v-tooltip="'あなただけが見ることができます'"
                icon="fa-solid fa-lock"
              />
              <font-awesome-icon
                v-if="isPublicNow"
                v-tooltip="'誰でも閲覧可能です'"
                icon="fa-solid fa-lock-open"
              />
            </button>
          </div>
        </div>

        <!-- MARK AS TEMP BOX -->
        <div class="mx-1 my-auto px-1 w-18 h-full">
          <toggle-button
            v-tooltip="isTemporary ? 'ドラフト状態です' : '清書状態です'"
            :value="!isTemporary"
            :color="{checked: '#EBDBB2', unchecked: '#1A1423'}"
            :switch-color="{checked: '#1A1423', unchecked: '#EBDBB2'}"
            :labels="{checked: '清書', unchecked: 'ドラフト'}"
            :width="70"
            :font-size="isTemporary ? 10 : 12"
            @change="onTemporaryChange"
          />
        </div>

        <!-- Binding Box -->
        <div class="my-1 px-1 w-18 h-full py-auto">
          <button
            v-tooltip="binding === 'vim' ? 'vimバインドです' : '通常のキーバインドです'"
            class="border-2 border-skdark hover:border-skdark-light p-1 rounded-md"
            :class="{'border-skdark-light': binding === 'vim'}"
            @click="onRequestBindingChange"
          >
            <img src="~/static/3rd/other/vim.png" class="w-4 my-auto">
          </button>
        </div>

        <!-- Edit or View -->
        <div class="px-1 my-1 w-10 h-full">
          <div class="border-2 border-skdark hover:border-skdark-light rounded-md">
            <button class="w-full h-full px-1 outline-none" @click="onRequestModeChange">
              <font-awesome-icon
                v-if="currentMode === 'edit'"
                v-tooltip="'編集モードです'"
                class="outline-none"
                icon="fa-solid fa-pen-fancy"
              />
              <font-awesome-icon
                v-else
                v-tooltip="'閲覧モードです'"
                class="outline-none"
                icon="fa-solid fa-eye"
              />
            </button>
          </div>
        </div>
      </div>

      <!--  Dirty Indicator -->
      <div
        class="text-lg font-bold pr-8 border-b-2
        md:border-b-0 md:border-l-2  border-skgray pb-1 md:pb-0 px-2 mb-1 md:mb-0"
      >
        <div class="w-7 h-7 text-center">
          <font-awesome-icon
            v-if="isDirty"
            v-tooltip="'サーバに保存していない変更があります'"
            icon="fa-solid fa-circle-exclamation"
            class="px-auto mx-auto"
          />
          <font-awesome-icon
            v-else
            v-tooltip="'サーバに保存された最新版と同期しています'"
            icon="fa-solid fa-star-of-david"
            class="px-auto mx-auto"
          />
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import { EditorBinding } from '~/components/editor/MainBox.vue';
import { EditorMode } from '~/pages/edit/_did.vue';

export default Vue.extend({
  name: 'Toolbar',

  props: {
    dateString: {
      type: String,
      required: true,
    },
    isTemporary: {
      type: Boolean,
      required: true,
    },
    isPublic: {
      type: Boolean,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      isSaving: false,
      isShowingSuccessSave: false,
      isPublicNow: this.isPublic,
      binding: 'vim' as EditorBinding,
      currentMode: this.mode as EditorMode,
      isDirty: false,
    };
  },

  methods: {
    doSave () {
      // @ts-ignore
      this.isSaving = true;
      this.$emit('requestSave');
    },

    onSaveComplete () {
      this.isShowingSuccessSave = true;
      setTimeout(() => { this.isShowingSuccessSave = false; }, 3000);
      this.isSaving = false;
    },

    onTemporaryChange ({ value }: {value: boolean}) {
      this.$emit('temporaryStateChanged', !value); // true means temporary
    },

    onPublicChange (value: boolean) {
      this.isPublicNow = value;
      this.$emit('publicStateChanged', value);
    },

    onRequestBindingChange () {
      if (this.binding === 'vim') {
        this.binding = 'plain';
      } else {
        this.binding = 'vim';
      }
      this.$emit('requestBindingChange', this.binding);
    },

    onRequestModeChange () {
      if (this.currentMode === 'view') {
        this.currentMode = 'edit';
      } else {
        this.currentMode = 'view';
      }
      this.$emit('requestModeChange', this.currentMode);
    },

    setDirty () {
      this.isDirty = true;
    },

    unsetDirty () {
      this.isDirty = false;
    },
  },
});

</script>
