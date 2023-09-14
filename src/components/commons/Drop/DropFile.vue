<script setup lang="ts">
import { useThrettleFn } from '@/utils';
import { ref } from 'vue';

const props = defineProps<{
  classFunc?: (w: boolean) => string;
}>();

const willDrop = ref(false);

const changeWillDrop = useThrettleFn((bool: boolean) => {
  willDrop.value = bool;
}, 20);

const dragenter = (e: DragEvent) => {
  e.stopPropagation();
  changeWillDrop(true);
};
const cancel = (e: DragEvent) => {
  e.stopPropagation();
  changeWillDrop(false);
};
</script>

<template>
  <!-- 出于某种未知原因，dragleave会异常触发，所以需要监听dragover事件 -->
  <div
    @dragenter="dragenter"
    @dragover="dragenter"
    @dragleave="cancel"
    @drop="cancel"
    :class="props.classFunc ? props.classFunc(willDrop) : ''"
  >
    <slot
      name="default"
      :willdrop="willDrop"
    ></slot>
    <slot
      v-if="willDrop"
      name="dropover"
    ></slot>
  </div>
</template>

<style scoped lang="less"></style>
