<script setup lang="ts">
import { Rarity, RarityToColor } from '@/components/Tags';
import { Image } from '@/components/commons/Image';
import { ClassNameFactor } from '@/utils';
import type { CardProps } from './interface';

const S = ClassNameFactor('card-');

defineProps<CardProps>();
</script>

<template>
  <div
    :class="
      S({
        outer: true,
        foucsing: foucsing ?? false
      })
    "
  >
    <div :class="S(['photo-container', `photo-container-${RarityToColor(star || 1)}`])">
      <Image
        :draggable="false"
        :src="imgUrl"
        width="120"
      />
    </div>
    <div :class="S('desc')">{{ desc }}</div>

    <div :class="S('mask')">
      <div :class="S('star-offset')"><slot></slot></div>
      <Rarity
        v-if="type !== 'character'"
        :rarity="star || 1"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.card-box {
  width: 120px;
  height: 150px;
}

.card {
  &-outer {
    .card-box();
    display: inline-block;
    margin: 5px 10px;
    background: @blank-white;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    box-shadow: @box-shadow;

    user-select: none;
  }

  &-foucsing {
    @keyframes shining {
      0% {
        box-shadow: 0px 0px 5px -6px white, 0px 0px 5px -6px white;
      }

      50% {
        box-shadow: 8px 0 5px -6px white, -8px 0 5px -6px white;
      }

      100% {
        box-shadow: 0px 0px 5px -6px white, 0px 0px 5px -6px white;
      }
    }
    animation: shining 4s linear infinite;
  }

  &-mask {
    .card-box();
    position: absolute;
    top: 0;
  }

  &-photo-container {
    width: 100%;
    height: 80%;
    border-bottom-right-radius: 25%;
    overflow: hidden;
    &-golden {
      background: @rank-golden-gradient;
    }
    &-purple {
      background: @rank-purple-gradient;
    }
    &-blue {
      background: @rank-blue-gradient;
    }
    &-green {
      background: @rank-green-gradient;
    }
    &-gray {
      background: @rank-gray-gradient;
    }
  }
  &-desc {
    text-align: center;
    font-size: 19px;
    height: 30px;
    line-height: 30px;

    color: @fontdarkgray;
  }
  &-star-offset {
    height: 70%;
  }
}
</style>
