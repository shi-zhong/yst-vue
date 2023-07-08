<script setup lang="ts">
import { ClassNameFactor } from '@/utils/className';
import { Button } from '@/components';

import Back from '@/assets/icons/back.svg';
import Close from '@/assets/icons/close.svg';

import { useCharacterStateStore } from '@/stores/Character/CharacterState'

const S = ClassNameFactor('character-page-header-');

const store = useCharacterStateStore();

</script>

<template>
  <div :class="S()">
    <div :class="S('back-buttons')">
      <Button
        v-if="store.sidebar.stack.length >= 2"
        type="spread"
        :icon="Back"
        @click="() => {
          store.sidebar.pop();
        }"
      ></Button>
      <Button
        v-if="store.sidebar.stack.length === 1"
        type="spread"
        :icon="Close"
        @click="
          () => {
            
          }
        "
      ></Button>
    </div>
  </div>
</template>

<style scoped lang="less">
.character-page-header {
  &- {
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: row-reverse;
  }

  &-back-buttons {
    margin: 18px;
  }
}
</style>
