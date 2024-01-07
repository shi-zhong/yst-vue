<script setup lang="ts">
import { DetailCard as BasicDetailCard, Lock } from '@shi-zhong/genshin-ui';

import type { ArtifactSlots, ArtifactSuitModel } from '../interface';
import Describe from './ArtifactDescribe.vue';
import { ArtifactSlotsNameTransform } from '../functions';
import { reactive, toRefs, watch } from 'vue';
import { merge, ClassNameFactor } from '@/utils';
import { useArtifactStore } from '@/stores/Artifact';

interface ArtifactDetailCardProps {
  id: number;
  suit?: ArtifactSuitModel;
  size?: number;
  type: ArtifactSlots;
  lock: boolean;
  suitCount: 0 | 1 | 2 | 3 | 4 | 5;
  lvl: number;
  main: {
    key: string;
    value: string;
    [key: string]: any;
  };
  subs: {
    key: string;
    value: string;
    [key: string]: any;
  }[];
}

const props = withDefaults(defineProps<ArtifactDetailCardProps>(), {
  size: 50
});

const store = useArtifactStore();

const { main, subs, type, suitCount } = toRefs(props);

const S = ClassNameFactor('artifact-detail-card-');

const data = reactive<ArtifactSuitModel>(store.ArtifactSuitById(props.id));

/**
 * 为了兼容添加套装时，圣遗物不存在id的情况，需要有不依赖于id内置逻辑
 * 当id不存在时，优先执行props.suit模型
 **/
watch(
  [() => props.id, () => props.suit],
  () => {
    if (props.id === 0 && props.suit) {
      merge(data, props.suit);
    } else {
      merge(data, store.ArtifactSuitById(props.id));
    }
  },
  { immediate: true }
);
</script>

<template>
  <BasicDetailCard
    :title="data.slots[type]!.name"
    :rarity="data.rarity"
    :main="main"
    :imgUrl="'http://localhost:8000/static/artifacts/' + data.slots[type]!.imgUrl"
    :type="ArtifactSlotsNameTransform(type)"
    :size="size"
  >
    <div :class="S('lvl-container')">
      <div :class="S('lvl')">+{{ lvl }}</div>
      <Lock
        :size="(30 / 50) * size"
        :lock="lock"
      />
    </div>
    <div :class="S('attributes')">
      <div
        v-for="i in subs"
        :key="i.key + i.value"
      >
        {{ ' · ' }}
        {{ i.key }}+{{ i.value }}
      </div>
    </div>
    <Describe
      :class="S('effect-describe')"
      :id="id"
      :suit="suit"
      :active="suitCount"
    />
    <div :class="S('txt-describe')">{{ data.slots[type]!.describe }}</div>
  </BasicDetailCard>
</template>

<style scoped lang="less">
.artifact-detail-card {
  &-attributes > div {
    color: @fontdarkgray;
    font-size: var(--attribute-size);
    margin: 4px 0;
  }

  &-effect-describe {
    font-size: var(--attribute-size);
    margin-top: 15px;
  }

  &-txt-describe {
    margin-top: 10px;
    font-size: var(--attribute-size);
    color: @fontlightgray;
  }

  &-lvl {
    &-container {
      display: flex;
      justify-content: space-between;
      align-items: center;

      height: 50px;
    }
    display: inline-block;
    // margin: 0 10px;
    padding: 0 10px;
    border-radius: 3px;
    background-color: @shadow;
    font-size: calc(var(--attribute-size) * 0.8);

    color: @blank-white;
  }
}
</style>
