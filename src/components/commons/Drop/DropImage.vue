<script setup lang="ts">
import { Drop } from '@/utils/directive/dropFile';
import DropFile from './DropFile.vue';
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
  <DropFile
    v-drop="
      (imgUrl:string, file: File) => {
        if (file.type.startsWith('image')) {
          realSrc = imgUrl;
          emits('update:modelValue', file)
        }
      }
    "
    :class="{
      'drop-image': true,
      backimg: !realSrc
    }"
    :class-func="(w) => (w ? 'drop-opacity' : '')"
  >
    <img
      v-show="realSrc"
      :src="realSrc"
      style="display: inline-block"
      :style="props.size !== 0 ? { width: `${props.size}px` } : undefined"
      draggable="false"
    />
  </DropFile>
</template>

<style scoped lang="less">
.drop-image {
  display: inline-block;
}
.backimg {
  background-image: url(@/assets/icons/upload.png);
  background-position: center;
}
.drop-opacity {
  opacity: 0.5;
}
</style>
