<template>
  <layout-wrapper>
    <layout-main-box>
      <div class="flex flex-col p-4">
        <div class="border-b-2 my-2">
          <write-todays-write class="mb-6" />
        </div>

        <div class="border-b-2 pb-6">
          <write-temp-write class="mt-6" />
        </div>

        <div class="border-b-2 my-2 pb-6">
          <write-old-edit class="mt-6" />
        </div>
      </div>
    </layout-main-box>
  </layout-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'WritePage',
});

</script>
