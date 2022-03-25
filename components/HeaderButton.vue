<template>
  <layout-wrapper>
    <button class="pb-1 border-b-2 md:border-0">
      <div
        class="md:mx-2 px-2 md:px-4 my-auto rounded hover:bg-skwhite-dark whitespace-nowrap"
        :class="buttonClass"
      >
        <p v-if="entry.to !== undefined" class="md:text-2xl">
          <nuxt-link :to="entry.to">
            {{ entry.text }}
          </nuxt-link>
        </p>
        <p v-else class="text-2xl">
          {{ entry.text }}
        </p>
      </div>
    </button>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export type HeaderButtonEntry = {
  text: string,
  to: string,
}

export default Vue.extend({
  name: 'HeaderButton',
  props: {
    entry: {
      type: Object as PropType<HeaderButtonEntry>,
      required: true,
    },
    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data () {
    return {};
  },

  computed: {
    buttonClass: function () {
      return this !== undefined && this.selected ? 'bg-skwhite-dark' : '';
    },
  },
});
</script>
