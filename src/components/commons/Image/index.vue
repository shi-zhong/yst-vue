<script setup lang="ts">
defineProps<{
  src?: string;
  draggable?: boolean;
  width?: string | number;
}>();

const handleSrc = (src?: string) => {
  if (src === undefined) {
    return '';
  } else if (src.startsWith('data:image') || src.startsWith('/src/assets')) {
    return src;
  } else {
    return 'http://localhost:8000/static/' + src;
  }
};
</script>

<template>
  <img
    :src="handleSrc(src)"
    :draggable="draggable"
    :width="width"
  />
</template>
