<template>
  <layout-wrapper>
    <div class="bg-gray-300 px-2 border-2 border-gray-600 flex items-center">
      <div>
        {{ dateString }}
      </div>

      <div class="flex ml-2">
        <div class="m-1 px-1 bg-white hover:bg-gray-200 border-2 border-black rounded-md h-full">
          <div v-show="isSaving" class="w-14 h-6">
            <vue-loading :size="{width: '20px', height: '12px'}" type="beat" />
          </div>
          <button v-show="!isSaving" class="w-full h-full" @click="doSave">
            <font-awesome-icon icon="fa-solid fa-floppy-disk" />
            保存
          </button>
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
  },

  data () {
    return {
      isSaving: false,
    };
  },

  methods: {
    doSave () {
      this.isSaving = true;
      this.$emit('requestSave');
    },

    onSaveComplete () {
      // TODO: show success icon for a specific time
      this.isSaving = false;
    },
  },
});

</script>
