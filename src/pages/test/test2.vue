<script setup lang="ts">
import { Modal } from '@@/commons/Modal/index';
import { ScrollView } from '@/components';
import { ref } from 'vue';

const visible = ref(0);

</script>

<template>
  <Modal
    :visible="visible"
    theme="light"
    @close="
      () => {
        visible = 0;
      }
    "
    :ok="{
      text: 'ok'
    }"
    :cancel="{ text: '', disable:true }"
  >
    <ScrollView root-class="root">
      <div style="height: 500px; width: 800px">456</div>
    </ScrollView>
  </Modal>
  <button @click="visible++">open</button>
</template>

<style scoped lang="less">
.root {
  height: 500px;
}
</style>
