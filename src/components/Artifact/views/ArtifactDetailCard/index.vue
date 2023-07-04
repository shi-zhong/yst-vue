<script setup lang="ts">
import { Lock, Enable } from '@/components/Tags';
import BasicDetailCard from '@/components/DetailCard/index.vue';
import { ClassNameFactor } from '@/utils/className';
import { type ArtifactSolt, type ArtifactSuitModel } from '../../interfaces';

import { GetArtifactSolt, GetArtifactTypeChinese } from '../../functions';

import { onMounted, reactive, toRefs } from 'vue';

interface ArtifactDetailCardProps extends BasicDetailCardProps {
  id: number;
  artifact: ArtifactSuitModel;
  type: ArtifactSolt;
  lock: boolean;
  suitCount: 0 | 1 | 2 | 3 | 4 | 5;
  lvl: number;
  subs: {
    key: string;
    value: string;
    [key: string]: any;
  }[];
}

const props = defineProps<ArtifactDetailCardProps>();

const { id, subs, artifact, type, suitCount } = toRefs(props);

const S = ClassNameFactor('artifact-detail-card-');

const solt = reactive({ name: '', imgUrl: '', describe: '' });

onMounted(() => {
  Object.assign(solt, GetArtifactSolt(artifact.value, type.value));
});
</script>

<template>
  <BasicDetailCard
    {...props}
    :imgUrl="solt.imgUrl"
    :title="solt.name"
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
      <div :class="S('describe-enable')">{{ artifact.name }}:</div>
      <div :class="S('effect-box')">
        <div
          v-for="i in artifact.effects"
          :key="i.limit"
          :style="{ overflow: 'hidden' }"
        >
          <Enable
            :size="20"
            :enable="i.limit <= suitCount"
            :style="{ float: 'left' }"
          />
          <div
            :class="
              S({
                'describe-enable': i.limit <= suitCount,
                effect: true
              })
            "
          >
            {{ i.limit }}件套：{{ i.describe }}
          </div>
        </div>
      </div>
      <div>{{ solt.describe }}</div>
    </div>
  </BasicDetailCard>
</template>

<style scoped lang="less">
.artifact-detail-card {
  &-attributes > div {
    color: @fontdarkgray;
    margin: 4px 0;
  }

  &-effect {
    padding-left: 30px;
    text-align: justify;
    &-box {
      margin: 10px 0;
    }
  }

  &-describe {
    &-enable {
      color: @fontgreen;
    }
    color: @fontlightgray;
    font-size: 21px;

    vertical-align: middle;
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
