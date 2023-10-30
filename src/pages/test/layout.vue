<script setup lang="ts">
import CharacterLayout from '@/layout/Character/index.vue';
import Stainer from './stainer.vue';

const options = [
  { txt: '属性', url: 'attr' },
  { txt: '命之座', url: 'lives' },
  { txt: '天赋', url: 'talents' },
  { txt: '资料', url: 'data' }
];
</script>

<template>
  <CharacterLayout
    :menu="options"
    :content="[
      {
        left: ['talents', 'lives'],
        right: ['talents', 'lives'],
        fc: Stainer
      }
    ]"
  />
</template>

<style scoped lang="less"></style>
