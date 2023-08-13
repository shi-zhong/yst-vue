<script setup lang="ts">
import { SidebarComponents } from './index';
import { computed } from 'vue';

import { useCharacterStateStore } from '@/stores/Character/CharacterState';

const store = useCharacterStateStore();

const current = computed(
  () =>
    SidebarComponents[
      store.sidebarCurrent !== 'story'
        ? store.sidebarCurrent
        : 'folding'
    ]
);
</script>
<template>
  <Transition name="switch">
    <KeepAlive>
      <component
        :is="current"
        @click.stop="() => {}"
      />
    </KeepAlive>
  </Transition>
</template>
<style scoped lang="less">
.switch {
  &-enter-from {
    transform: translateX(-500px);
  }

  &-enter-active {
    transition: all 0.3s ease-in-out;
    z-index: 2;
  }

  &-leave-active {
    transition: all 0.3s ease-in-out;
    z-index: 1;
  }

  &-leave-to {
    transform: translateX(-500px);
  }
}
</style>
