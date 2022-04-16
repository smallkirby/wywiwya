<template>
  <layout-wrapper>
    <transition>
      <div class="dialog-wrapper items-center">
        <div
          class="bg-skdark-dark rounded-md drop-shadow-2xl md:w-[50rem] mx-6 md:mx-auto
          py-auto my-40 py-4 px-4 md:px-8 border-2 border-gray-400"
        >
          <div class="flex flex-col">
            <div class="text-2xl mb-3">
              {{ config.title }}
            </div>

            <div class="mx-6">
              <slot />
            </div>

            <div
              class="flex mt-4 mx-4 text-right"
              :class="{
                'justify-between': config.typ === 'choose',
                'justify-end': config.typ !== 'choose',
              }"
            >
              <div v-if="config.typ === 'choose'">
                <button
                  class="border-2 border-gray-700 hover:bg-skwhite-dark px-4 hover:text-skdark rounded-md"
                  @click="onCancelClick"
                >
                  {{ config.cancelText }}
                </button>
              </div>

              <div class="text-right">
                <button
                  class="border-2 border-gray-700 hover:bg-skwhite-dark px-4 hover:text-skdark rounded-md"
                  @click="onOkClick"
                >
                  <p v-if="config.typ === 'choose'">
                    {{ config.okText }}
                  </p>
                  <p v-else>
                    {{ config.closeText }}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export type DialogType = 'confirm' | 'choose';

type DialogBase = {
  typ: DialogType,
  title: string,
};

export type ConfirmDialog = {
  closeText: string,
  closeEmission: string,
} & DialogBase;

export type ChooseDialog = {
  okText: string,
  okEmission: string,
  cancelText: string,
  cancelEmission: string,
} & DialogBase;

export type Dialog = ConfirmDialog | ChooseDialog;

export default Vue.extend({
  name: 'Dialog',
  props: {
    config: {
      type: Object as PropType<Dialog>,
      required: true,
    },
  },

  data () {
    return {};
  },

  methods: {
    onOkClick () {
      if (this.config.typ === 'confirm') {
        const config = this.config as ConfirmDialog;
        this.$emit(config.closeEmission);
      } else if (this.config.typ === 'choose') {
        const config = this.config as ChooseDialog;
        this.$emit(config.okEmission);
      }
    },

    onCancelClick () {
      const config = this.config as ChooseDialog;
      this.$emit(config.cancelEmission);
    },
  },
});
</script>

<style scoped>
.dialog-wrapper {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: table;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 2.0s ease;
}
</style>
