<script setup lang="tsx">
import { ClassNameFactor } from '@/utils/className';
import { computed } from 'vue';

const props = defineProps<{ text: string }>();

const S = ClassNameFactor('highlight-');

const PreDecode = computed(() =>
  props.text
    .trim()
    .split('\n')
    .map((i) => i.trim())
    .map((i) => Decode(i))
    .flat()
);

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

const Decode = (str: string) => [
  ...str
    .split('$')
    .filter((i) => i)
    .map((str) => {
      const className = staticDecodeMapper[str[0]];
      if (className !== undefined) {
        return <span class={className}>{str.slice(1)}</span>;
      } else {
        return <>{str}</>;
      }
    }),
  <br />
];
</script>

<template>
  <div>
    <template
      v-for="(node, index) in PreDecode"
      :key="index"
    >
      <component :is="node"></component>
    </template>
  </div>
</template>

<style scoped lang="less">
@import url(./index.less);
.highlight {
  &-spe {
    color: @highlight-spe;
  }

  &-fire {
    color: @highlight-fire;
  }

  &-water {
    color: @highlight-water;
  }

  &-elec {
    color: @highlight-elec;
  }

  &-ice {
    color: @highlight-ice;
  }

  &-grass {
    color: @highlight-grass;
  }

  &-wind {
    color: @highlight-wind;
  }

  &-stone {
    color: @highlight-stone;
  }

  &-italic {
    font-style: italic;
  }
}
</style>
