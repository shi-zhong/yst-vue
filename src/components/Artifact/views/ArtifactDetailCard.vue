<script setup lang="ts">
import { Lock } from '@/components/Tags';
import BasicDetailCard from '@/components/DetailCard/index.vue';
import { ClassNameFactor } from '@/utils/className';
import { type ArtifactSlot } from '../interfaces';
import Describe from './ArtifactDescribe.vue';
import { GetArtifactTypeChinese, ArtifactEffectSearch } from '../functions';

import { reactive, toRefs, watch } from 'vue';
import { merge } from '@/utils';

interface ArtifactDetailCardProps {
  id: number;
  type: ArtifactSlot;
  lock: boolean;
  suitCount: 0 | 1 | 2 | 3 | 4 | 5;
  lvl: number;
  main: {
    key: string;
    value: string;
    [key: string]: any;
  };
  sub?: {
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

const props = defineProps<ArtifactDetailCardProps>();

const { sub, main, subs, type, suitCount } = toRefs(props);

const S = ClassNameFactor('artifact-detail-card-');

const data = reactive(ArtifactEffectSearch(props.id));

watch(
  () => props.id,
  () => {
    merge(data, ArtifactEffectSearch(props.id));
  }
);
</script>

<template>
  <BasicDetailCard
    :title="data.slots[props.type]!.name"
    :rarity="data.rarity"
    :sub="sub"
    :main="main"
    :imgurl="data.slots[props.type]!.imgUrl"
    :type="GetArtifactTypeChinese(type)"
  >
    <div :class="S('describe')">
      <div :class="S('lvl-container')">
        <div :class="S('lvl')">+{{ props.lvl }}</div>
        <Lock
          :size="30"
          :lock="props.lock"
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
        :id="props.id"
        :active="suitCount"
      />
      <div :class="S('txt-describe')">{{ data.slots[props.type]!.describe }}</div>
    </div>
  </BasicDetailCard>
</template>

<style scoped lang="less">
.artifact-detail-card {
  &-attributes > div {
    color: @fontdarkgray;
    font-size: 22px;
    margin: 4px 0;
  }

  &-effect-describe {
    font-size: 22px;
    margin-top: 15px;
  }

  &-txt-describe {
    margin-top: 10px;
    font-size: 22px;
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
    font-size: 18px;

    color: @blank-white;
  }
}
</style>
