<script setup lang="ts">
import Star from './assets/star.png';
import { ClassNameFactor } from '@/utils/className';

interface RarityBarProps {
  rarity: 1 | 2 | 3 | 4 | 5;
  className?: string;
  align?: 'left' | 'middle' | 'right';
  size?: number;
}

const props = defineProps<RarityBarProps>();

const S = ClassNameFactor('stars-');

</script>

<template>
  <div :class="S({ container: true, left: props.align === 'left' })">
    <img
      v-for="(_key, index) in Array(props.rarity)"
      :key="'star' + index"
      :draggable="false"
      class="stars"
      :src="Star"
      :style="{ width: `${props.size || 20}px` }"
    />
  </div>
</template>

<style scoped lang="less">
@import '../../assets/styles/index.less';

.stars {
  &-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  width: 20px;
  filter: drop-shadow(0.4px 0.4px 0.5px @fontdarkgray);

  &-left {
    justify-content: left;
  }
}
</style>
