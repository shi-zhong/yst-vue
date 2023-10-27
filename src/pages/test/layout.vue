<script setup lang="ts">
import CharacterLayout from '@/layout/Character/index.vue';

const options = [
  { txt: '属性', url: 'attr' },
  // { txt: '武器', url: 'weapon' },
  // { txt: '圣遗物', url: 'artifact' },
  { txt: '命之座', url: 'lives' },
  { txt: '天赋', url: 'talents' },
  { txt: '资料', url: 'data' }
];
</script>

<template>
  <CharacterLayout :menu="options" />
</template>

<style scoped lang="less"></style>
