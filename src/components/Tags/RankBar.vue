<script setup lang="ts">
import RankPicture from '@/assets/icons/rank_star.png';

withDefaults(
  defineProps<{
    rank: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    maxRank?: number;
    size?: number;
  }>(),
  {
    maxRank: 6
  }
);
</script>

<template>
  <div
    :style="{
      height: `${size || 25}px`
    }"
  >
    <template
      v-for="i in [0, 1, 2, 3, 4, 5]"
      :key="i"
    >
      <img
        class="rank-star"
        v-if="i < maxRank"
        :draggable="false"
        :src="RankPicture"
        :style="{
          width: `${size || 25}px`,
          filter: i >= rank ? 'brightness(50%)' : ''
        }"
      />
    </template>
  </div>
</template>
