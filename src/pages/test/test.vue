<script setup lang="ts">
import Modal from '@@/commons/Modal/Modal.vue';
import { ScrollView } from '@/components';
import { ref } from 'vue';

import { DropFile, DropImage } from '@/components';
import { Login } from '@/api';

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
  <ScrollView style="height: 500px; border: 1px solid black">
    <div style="background-color: rebeccapurple; height: 700px; overflow: hidden">
      <ScrollView style="height: 100px; border: 1px solid black; margin-top: 100px">
        <div style="background-color: red; height: 200px">123</div>
      </ScrollView>
    </div>
  </ScrollView>
  <button @click="Login">Get Token</button>
</template>

<style scoped lang="less">
.root {
  height: 500px;
}
</style>
