<template>
  <layout-wrapper>
    <div class="px-2 flex items-center">
      <div class="text-lg font-bold">
        {{ dateString }}
      </div>

      <div class="flex ml-2">
        <!-- SAVE BOX -->
        <div class="m-1 px-1 bg-white hover:bg-gray-200 border-2 border-black rounded-md h-full">
          <div v-show="isSaving" class="w-14 h-6">
            <vue-loading :size="{width: '20px', height: '12px'}" type="beat" />
          </div>
          <button v-show="!isSaving && !isShowingSuccessSave" class="w-full h-full" @click="doSave">
            <font-awesome-icon icon="fa-solid fa-floppy-disk" />
            保存
          </button>
          <button v-show="isShowingSuccessSave" class="w-full h-full mr-2 text-green-400">
            <font-awesome-icon icon="fa-solid fa-circle-check" />
            OK
          </button>
        </div>

        <!-- MARK AS TEMP BOX -->
        <div class="m-1 px-1 w-28 h-full">
          <div class="overflow-hidden">
            <ul class="z-20 absolute">
              <li
                class="bg-white hover:bg-gray-300 rounded-md border-2 pt-1
                text-sm border-black text-center overflow-hidden"
              >
                <button class="w-28 px-1 h-full" @click="onStartSelectingTemporary">
                  <font-awesome-icon :icon="temporarySelectParent.icon" />
                  {{ temporarySelectParent.text }}
                  <font-awesome-icon icon="fa-solid fa-caret-down" />
                </button>
              </li>
              <li
                v-for="(el,ix) in temporarySelectChildren"
                v-show="isSelectingTemporary"
                :key="ix"
                class="bg-white hover:bg-gray-300 rounded-md border-2 pt-1
                text-sm border-black text-center overflow-hidden"
              >
                <button class="w-28 px-1 h-full" @click="onStopSelectingTemporary">
                  <font-awesome-icon :icon="el.icon" />
                  {{ el.text }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';

export type TemporarySelectElement = {
  id: 'temporary' | 'no-temporary',
  text: string,
  selected: boolean,
  icon: string,
};
const temporarySelectElements: TemporarySelectElement[] = [
  {
    id: 'temporary',
    text: 'ドラフト',
    selected: false,
    icon: 'fa-solid fa-book-bookmark',
  },
  {
    id: 'no-temporary',
    text: '清書',
    selected: false,
    icon: 'fa-solid fa-check-double',
  },
];

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
  },

  data () {
    return {
      isSaving: false,
      isShowingSuccessSave: false,
      temporarySelectElements: temporarySelectElements,
      isSelectingTemporary: false,
    };
  },

  computed: {
    temporarySelectParent () {
      // @ts-ignore
      const ix = this.temporarySelectElements.findIndex((e: TemporarySelectElement) => { return e.selected; });
      if (ix === -1) {
        // @ts-ignore
        return this.temporarySelectElements[0];
      } else {
        // @ts-ignore
        return this.temporarySelectElements[ix];
      }
    },
    temporarySelectChildren () {
      // @ts-ignore
      const ix = this.temporarySelectElements.findIndex((e: TemporarySelectElement) => { return e.selected; });
      // @ts-ignore
      const temp = [...this.temporarySelectElements];
      temp.splice(ix, 1);
      return temp;
    },
  },

  created () {
    // @ts-ignore
    if (this.isTemporary) {
      // @ts-ignore
      // eslint-disable-next-line max-len
      const ix = this.temporarySelectElements.findIndex((e: TemporarySelectElement) => { return e.id === 'temporary'; });
      // @ts-ignore
      this.temporarySelectElements[ix].selected = true;
    } else {
      // @ts-ignore
      // eslint-disable-next-line max-len
      const ix = this.temporarySelectElements.findIndex((e: TemporarySelectElement) => { return e.id === 'no-temporary'; });
      // @ts-ignore
      this.temporarySelectElements[ix].selected = true;
    }
  },

  methods: {
    doSave () {
      // @ts-ignore
      this.isSaving = true;
      this.$emit('requestSave');
    },

    onSaveComplete () {
      // @ts-ignore
      this.isShowingSuccessSave = true;
      // @ts-ignore
      setTimeout(() => { this.isShowingSuccessSave = false; }, 3000);
      // @ts-ignore
      this.isSaving = false;
    },

    onStartSelectingTemporary () {
      // @ts-ignore
      this.isSelectingTemporary = true;
    },

    onStopSelectingTemporary () {
      // @ts-ignore
      this.isSelectingTemporary = false;
    },
  },
});

</script>
