<script setup lang="ts">
import CharacterLayout from '@/layout/Character/index.vue';
import Stainer from './stainer.vue';
import Data from './info.vue';
import Info from './data.vue'
import Modal from '@/components/commons/Modal/Modal.vue';
import { ref } from 'vue';

const options = [
  { txt: '属性', url: 'attr' },
  { txt: '命之座', url: 'lives' },
  { txt: '天赋', url: 'talents' },
  { txt: '资料', url: 'data' }
];

const visible = ref(0);
</script>

<template>
  <CharacterLayout
    :menu="options"
    :right="{
      attr: Info,
      data: Data
    }"
    :content="[
      {
        left: ['talents', 'lives'],
        right: ['talents', 'lives'],
        fc: Stainer
      }
    ]"
    @quit="() => (visible = 1)"
  />
  <Modal
    :visible="visible"
    mask
    theme="light"
    title="提示"
    cancelText="退出"
    okText="保存"
    @ok="() => (visible = 0)"
    @cancel="() => (visible = 0)"
    ><div class="dialog"><span>直接退出将导致修改丢失，是否保存？</span></div></Modal
  >
</template>

<style scoped lang="less">
.dialog {
  width: 100%;
  height: 350px;
  color: @fontdarkgray;
  font-size: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
