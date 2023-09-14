<script setup lang="ts">
/** @todo 使用网络获取数据  */
/** 抽离成组件是由于卡片模式和角色详情中都有用到圣遗物套装效果描述 */
import { Enable } from '@/components/Tags';
import { useArtifactStore } from '@/stores/Artifact';
import { reactive, watch } from 'vue';
import { merge } from '@/utils';
import type { ArtifactSuitModel } from '..';

interface ArtifacDescribe {
  id: number; //id
  active: number; // 激活数
  suit?: ArtifactSuitModel;
  hideDisable?: boolean;
}

const props = withDefaults(defineProps<ArtifacDescribe & { size?: number }>(), {
  size: 50
});

const store = useArtifactStore();

const data = reactive<ArtifactSuitModel>(store.ArtifactSuitById(props.id));

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
  <div :style="`--title-height: ${size}px`">
    <div class="describe-enable">{{ data.name }}:</div>
    <div
      class="suit"
      v-for="i of data.effects"
      :key="i.limit"
      v-show="!(hideDisable && i.limit > active)"
    >
      <Enable
        :size="size / 3"
        :enable="i.limit <= active"
      />
      <div
        :class="{
          'describe-enable': i.limit <= active,
          effect: true
        }"
      >
        {{ i.limit }}件套：{{ i.describe }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.effect {
  text-align: justify;
  display: inline-block;
  color: @fontlightgray;
  line-height: calc(var(--title-height, 50px) * 0.5);
}
.suit {
  display: flex;
  justify-content: start;
  align-items: flex-start;
  margin-top: 5px;
}
.describe-enable {
  color: @fontgreen;
}
</style>
