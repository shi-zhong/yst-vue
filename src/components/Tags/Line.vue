<script setup lang="ts">
import { ClassNameFactor } from '@/utils/className';
import RankPicture from '@/assets/icons/rank_star.png';

const S = ClassNameFactor('line-');
</script>

<template>
  <div :class="S('line')">
    <img
      :class="S('rank')"
      :src="RankPicture"
      alt=""
    />
  </div>
</template>

<style scoped lang="less">
.line {
  &-line {
    // width: 100%;
    margin: 0 12px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;

    opacity: 0.3;

    &::before {
      content: '';
      display: block;
      width: 45%;
      height: 3px;
      background-color: white;
    }
    &::after {
      content: '';
      display: block;
      width: 45%;
      height: 3px;
      background-color: white;
    }
  }
  &-rank {
    width: 30px;
  }
}
</style>
