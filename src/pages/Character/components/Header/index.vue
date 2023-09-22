<script setup lang="ts">
import { ClassNameFactor } from '@/utils/className';
import { Button } from '@/components';

import Back from '@/assets/icons/back.png';
import Close from '@/assets/icons/close.png';
import { Sound } from '@/utils/sound';
import { useCharacterStateStore } from '@/stores/Character/CharacterState';

const S = ClassNameFactor('character-page-header-');

const store = useCharacterStateStore();
</script>

<template>
  <div :class="S()">
    <div :class="S('back-buttons')">
      <Button
        v-if="['expand', 'story', 'filter'].includes(store.sidebarCurrent)"
        type="spread"
        :icon="Back"
        @click="
          () => {
            store.sidebar.next('back');
            Sound.winClose.replay();
          }
        "
      ></Button>
      <Button
        v-if="store.sidebarCurrent === 'folding'"
        type="spread"
        :icon="Close"
        @click="
          () => {
            Sound.winClose.replay();
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
