<template>
  <layout-wrapper>
    <div class="mx-2 px-4 my-auto">
      <p class="text-2xl">
        {{ entry.text }}
      </p>
    </div>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export type HeaderButtonEntry = {
  text: string,
}

export default Vue.extend({
  name: 'HeaderButton',
  props: {
    entry: {
      type: Object as PropType<HeaderButtonEntry>,
      required: true,
    },
  },
  data () {
    return {
      selected: false,
    };
  },
});
</script>
