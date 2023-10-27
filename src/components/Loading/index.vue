<script setup lang="ts">
import { ElementPng } from '@/interface/elements';
import { Icon } from '..';

withDefaults(defineProps<{
  progress: number;
}>(), {
  progress: 0
})
</script>

<template>
  <div class="loading">
    <div class="unload">
      <Icon
        v-for="ele of (Object.keys(ElementPng) as (keyof typeof ElementPng)[])"
        class="element"
        type="projection"
        color="rgb(245,245,245)"
        :size="60"
        :key="ele"
        :src="ElementPng[ele]"
        :alt="ele"
      />
    </div>
    <div class="loaded" :style="{width: `${progress}%`}">
      <Icon
        v-for="ele of (Object.keys(ElementPng) as (keyof typeof ElementPng)[])"
        class="element"
        type="projection"
        color="rgb(102,102,102)"
        :size="60"
        :key="ele"
        :src="ElementPng[ele]"
        :alt="ele"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.loading {
  display: inline-block;
  position: relative;
}

.loaded {
  display: inline-block;
  position: absolute;
  top: 0;
  white-space: nowrap;
  overflow: hidden;
  transition: .3s;
}

.element {
  margin: 10px;
}
</style>
