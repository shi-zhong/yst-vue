<script setup lang="ts">
import { Enable } from '@/components/Tags';
/** @todo 使用网络获取数据  */
import { ArtifactEffectSearch } from '../functions';
import { onMounted, reactive, watch } from 'vue';
import { merge } from '@/utils';
import type { ArtifactSuitModel } from '..';

interface ArtifacDescribe {
  id: number;
  active: number; // 激活数
  suit?: ArtifactSuitModel;
  hideDisable?: boolean;
}

const props = withDefaults(defineProps<ArtifacDescribe & { size?: number }>(), {
  size: 50
});

const data = reactive<ArtifactSuitModel>(ArtifactEffectSearch(props.id));

watch(
  [() => props.id, () => props.suit],
  () => {
    if (props.id === 0 && props.suit) {
      merge(data, props.suit);
    } else {
      merge(data, ArtifactEffectSearch(props.id));
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <div class="describe-enable">{{ data.name }}:</div>
    <div
      class="suit"
      v-for="i of data.effects"
      :key="i.limit"
      v-show="!(props.hideDisable && i.limit > props.active)"
    >
      <Enable
        :size="props.size / 3"
        :enable="i.limit <= props.active"
      />
      <div
        :class="{
          'describe-enable': i.limit <= props.active,
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
  line-height: calc(var(--title-height, 50px) * 0.6);
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
