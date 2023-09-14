<script setup lang="ts">
import { Rarity, RarityToColor } from '@/components/Tags';
import { ClassNameFactor } from '@/utils/className';
import { toRefs } from 'vue';
import { type BasicDetailCardProps } from './interface';

const props = withDefaults(defineProps<BasicDetailCardProps & { size?: number }>(), {
  size: 50
});

const { title, type, sub, main, rarity, imgurl } = toRefs(props);

const S = ClassNameFactor('common-detail-card');
</script>

<template>
  <div
    :class="S()"
    :style="`--title-height: ${size}px`"
  >
    <div :class="S({ '-title': ['', `-${RarityToColor(rarity)}`] })">
      <p>{{ title || 'Title' }}</p>
    </div>
    <div :class="S({ '-attribute': ['', `-${RarityToColor(rarity)}`] })">
      <div :class="S('-attribute-data')">
        <div>{{ type }}</div>
        <div>{{ sub?.key || '' }}</div>

        <div>{{ sub?.value || '' }}</div>
        <div>{{ main.key }}</div>

        <div>{{ main.value }}</div>
        <Rarity
          :rarity="rarity"
          align="left"
          :size="(30 / 50) * props.size"
        />
      </div>
      <img
        :draggable="false"
        :src="imgurl"
        alt="img"
      />
    </div>
    <div :class="S('-describe')"><slot></slot></div>
  </div>
</template>

<style scoped lang="less">
.common-detail-card {
  --title-border: calc(var(--title-height) / 17);
  --leftindent: calc(var(--title-height) / 2);
  --half-leftindent: calc(var(--title-height) / 4);
  --4-title-height: calc(4 * var(--title-height));
  --5-title-height: calc(5 * var(--title-height));
  --4-more-leftindent: calc(var(--leftindent) + 4px);

  margin: 10px;
  width: calc(9 * var(--title-height));
  box-shadow: @box-shadow;
  user-select: none;
  background: @blank-white;

  &-title {
    position: relative;
    height: var(--title-height);
    line-height: var(--title-height);
    padding: 3px;
    font-size: 25px;

    display: flex;
    align-items: center;

    & > p {
      width: 100%;
      box-sizing: border-box;
      border: var(--title-border) solid rgba(56, 56, 56, 0.2);
      padding-left: var(--leftindent);

      font-size: var(--leftindent);

      color: @blank-white;
    }

    &-golden {
      background: @rank-golden-bar;
    }
    &-purple {
      background: @rank-purple-bar;
    }
    &-blue {
      background: @rank-blue-bar;
    }
    &-green {
      background: @rank-green-bar;
    }
    &-gray {
      background: @rank-gray-bar;
    }
  }

  &-attribute {
    height: var(--4-title-height);

    &-golden {
      background: @rank-golden-gradient-box;
    }
    &-purple {
      background: @rank-purple-gradient-box;
    }
    &-blue {
      background: @rank-blue-gradient-box;
    }
    &-green {
      background: @rank-green-gradient-box;
    }
    &-gray {
      background: @rank-gray-gradient-box;
    }

    & > :first-child {
      display: inline-block;
      vertical-align: top;
      width: var(--5-title-height);
      box-sizing: border-box;
      padding-left: var(--4-more-leftindent);
      padding-top: var(--half-leftindent);
      padding-bottom: var(--half-leftindent);
    }

    & > :last-child {
      width: var(--4-title-height);
    }

    &-data {
      & > div {
        box-sizing: border-box;

        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(4) {
          height: var(--leftindent);
          line-height: var(--leftindent);
          color: @blank-white;
          font-size: calc(var(--half-leftindent) * 1.5);
        }

        &:nth-child(3) {
          font-size: calc(var(--half-leftindent) * 1.8);
        }

        &:nth-child(2),
        &:nth-child(4) {
          opacity: 0.5;
        }
        &:nth-child(5) {
          height: var(--title-height);
          line-height: var(--title-height);
          color: @blank-white;
          font-size: calc(var(--half-leftindent) * 3);
        }
      }
    }
  }

  &-describe {
    padding: var(--half-leftindent) var(--4-more-leftindent) var(--title-height)
      var(--4-more-leftindent);
    font-size: calc(var(--half-leftindent) * 1.685);
    line-height: calc(var(--leftindent) + 5px);
  }
}
</style>
