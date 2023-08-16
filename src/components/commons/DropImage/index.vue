<script setup lang="ts">
import { Drop } from '@/utils/directive/dropFile';
import { ref, watch } from 'vue';
import Upload from '@/assets/icons/upload.png';

const props = defineProps<{
  src: string;
  size?: number;
  modelValue: File | undefined;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', file: File): void;
}>();

const { vDrop } = Drop();

const realSrc = ref(props.src || Upload);

watch(
  () => props.src,
  () => (realSrc.value = props.src)
);
</script>

<template>
  <div
    v-drop="
      (imgUrl:string, file: File) => {
        if (file.type.startsWith('image')) {
          realSrc = imgUrl;
          emits('update:modelValue', file)
        }
      }
    "
    style="display: inline-block"
  >
    <img
      :src="realSrc || Upload"
      style="display: inline-block"
      :style="props.size !== 0 ? { width: `${props.size}px` } : undefined"
      draggable="false"
    />
  </div>
</template>

<style scoped lang="less"></style>
