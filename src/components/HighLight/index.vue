<script setup lang="tsx">
import { ClassNameFactor } from '@/utils/className';
import { computed } from 'vue';

const props = defineProps<{ text: string }>();

const S = ClassNameFactor('highlight-');

const staticDecodeMapper: { [key: string]: string } = {
  '0': S('spe'),
  '1': S('fire'),
  '2': S('water'),
  '3': S('elec'),
  '4': S('ice'),
  '5': S('grass'),
  '6': S('wind'),
  '7': S('stone'),
  '8': S('italic')
};

// 默认所有字符只有单个样式，采用最简单的编码方式
const Decode = computed(() =>
  props.text
    .trim()
    .split('$')
    .filter((i) => i)
    .map((str) => ({
      style: staticDecodeMapper[str[0]],
      text: staticDecodeMapper[str[0]] ? str.slice(1) : str
    }))
);
</script>

<template>
  <div class="highlight">
    <span
      v-for="(node, index) in Decode"
      :key="index"
      :class="node.style ?? ''"
    >
      {{ node.text }}
    </span>
  </div>
</template>

<style scoped lang="less">
@import './index.less';

.highlight {
  white-space: pre-line;
}
</style>
