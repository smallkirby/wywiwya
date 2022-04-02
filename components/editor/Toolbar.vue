<template>
  <layout-wrapper>
    <div class="px-2 flex items-center">
      <div class="text-lg font-bold pr-4 border-r-2 border-skgray">
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
        <div class="m-1 px-1 w-18 h-full">
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
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';

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
  },

  data () {
    return {
      isSaving: false,
      isShowingSuccessSave: false,
      isPublicNow: this.isPublic,
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
  },
});

</script>
