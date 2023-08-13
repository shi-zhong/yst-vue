<script setup lang="ts">
import { Enable } from '@/components/Tags';
/** @todo 使用网络获取数据  */
import { ArtifactEffectSearch } from '../functions';
import { reactive, watch } from 'vue';
import { merge } from '@/utils';

interface ArtifacDescribe {
  id: number;
  active: number; // 激活数
  hideDisable?: boolean;
}

const props = defineProps<ArtifacDescribe>();

const data = reactive(ArtifactEffectSearch(props.id));

watch(
  () => props.id,
  () => {
    merge(data, ArtifactEffectSearch(props.id));
  }
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
        :size="20"
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
