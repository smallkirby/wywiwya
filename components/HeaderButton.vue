<template>
  <layout-wrapper>
    <button>
      <div class="mx-2 px-4 my-auto rounded hover:bg-skwhite-dark" :class="buttonClass">
        <p v-if="entry.to !== undefined" class="text-2xl">
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
