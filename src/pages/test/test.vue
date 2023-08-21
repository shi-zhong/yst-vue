<script setup lang="ts">
import { Modal } from '@@/commons/Modal/index';
import { ScrollView } from '@/components';
import { ref } from 'vue';

import { DropFile, DropImage } from '@/components';

const visible = ref(0);
const visible1 = ref(0);
const visible2 = ref(0);
</script>

<template>
  <Modal
    :visible="visible"
    mask
    @close="
      () => {
        visible = 0;
      }
    "
  >
    <ScrollView root-class="root">
      <div style="height: 500px; width: 800px">456</div>
    </ScrollView>
  </Modal>
  <Modal
    :visible="visible1"
    mask
    @close="
      () => {
        visible1 = 0;
      }
    "
  >
  </Modal>
  <Modal
    :visible="visible2"
    mask
    @close="
      () => {
        visible2 = 0;
      }
    "
  >
    <ScrollView root-class="root">
      <div style="height: 500px; width: 800px">123</div>
    </ScrollView>
  </Modal>
  <button @click="visible++">uniqueinfobase</button>
  <button @click="visible1++">open</button>
  <button @click="visible2++">open</button>
  <DropFile style="background-color: red; width: 100px; height: 100px; display: inline-block">
    <div></div>
    <template #dropover> dropover </template>
  </DropFile>
  <DropImage />
</template>

<style scoped lang="less">
.root {
  height: 500px;
}
</style>
