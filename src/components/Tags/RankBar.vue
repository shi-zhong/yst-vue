<script setup lang="ts">
import RankPicture from '@/assets/icons/rank_star.webp';

interface RankBarProps {
  rank: 0 | 1 | 2 | 3 | 4 | 6;
  size?: number;
  display?: 'block' | 'inline-block';
}

const props = defineProps<RankBarProps>();

</script>

<template>
  <div :style="{ display: props.display }">
    <img
      v-for="i in [0, 1, 2, 3, 4, 5]"
      :key="i"
      :draggable="false"
      :src="RankPicture"
      :style="{
        width: `${props.size || 25}px`,
        filter: i >= props.rank ? 'brightness(50%)' : ''
      }"
    />
  </div>
</template>
