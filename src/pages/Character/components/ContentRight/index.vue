<script setup lang="ts">
import { ContentRightComponents } from './index';
import { useCharacterStateStore } from '@/stores/Character/CharacterState';
import { computed } from 'vue';

const store = useCharacterStateStore();

const current = computed(() => ContentRightComponents[store.cRight]);

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
  &-enter-from, &-leave-to {
    transform: translateX(50px);
    opacity: 0;
  }

  &-enter-active {
    transition: all 0.2s ease-in-out;
    z-index: 2;
  }

  &-leave-active {
    transition: all 0.2s ease-in-out;
    z-index: 1;
  }
}
</style>
