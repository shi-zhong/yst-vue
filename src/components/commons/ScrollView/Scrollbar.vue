<script setup lang="ts">
import { ref } from 'vue';

import { useMockScrollDrag } from '@/utils/hooks';

interface ScrollbarProps {
  customScrollbar?: string;
  heights: { client: number; scroll: number };
  scrollTop: number;
}

interface ScrollbarEmits {
  (e: 'syncTransform', x: number, y: number): void;
  (e: 'resetWhenBlankVisible'): void;
}

defineProps<ScrollbarProps>();
const emits = defineEmits<ScrollbarEmits>();

const thumbRef = ref();

// 滚动事件只注册一次
useMockScrollDrag(thumbRef, {
  moveMethod(e) {
    emits('syncTransform', 0, e.calcMovementY);
  },
  mouseUp() {
    emits('resetWhenBlankVisible');
  }
});
</script>

<template>
  <div :class="'scroll-track '">
    <div
      class="scroll-thumb"
      :style="`transform: translateY(${(scrollTop * heights.client) / heights.scroll}px); height:${
        heights.client ** 2 / heights.scroll
      }px;`"
      ref="thumbRef"
      @dragstart.stop.prevent="() => {}"
    ></div>
  </div>
</template>

<style scoped lang="less">
.scroll {
  @width: 5px;
  &-track {
    position: absolute;
    top: 0;
    right: 0;

    background: rgba(76, 76, 76, 0.3);
    width: @width;
    height: 100%;
    overflow: hidden;
  }
  &-thumb {
    width: 5px;
    background: rgba(217, 217, 217, 0.5);
    border-radius: 2px;
    transition: 'width' 0.3s;

    &:hover {
      background: rgba(217, 217, 217, 0.8);
    }
  }
}
</style>
