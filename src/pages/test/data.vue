<script setup lang="ts">
import { WeaponTypesTransform } from '@/components';
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';
import { useConfig } from '@/stores/config';

const store = useCharacterLayoutStore();
const config = useConfig();
</script>

<template>
  <div class="basic-data-container">
    <div class="name">
      {{ store.characterStatic?.basic.name }}
    </div>
    <div class="list-item">
      <span>使用武器</span>
      <span>{{
        WeaponTypesTransform(config.weaponTypeCode(store.characterStatic?.basic.weapon || 1))
      }}</span>
    </div>

    <div class="intro">{{ store.characterStatic?.basic.intro }}</div>
  </div>
</template>

<style scoped lang="less">
.basic-data-container {
  height: 100%;
  padding: 40px 0;
  box-sizing: border-box;
  margin: 0 50px;

  color: @blank-white;
}
.name {
  font-size: 28px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  padding: 3px;
  font-size: 20px;
  margin: 20px 0;
}

.intro {
  font-size: 20px;
  opacity: 0.8;
}
</style>
