<script setup lang="ts">
import FoldingCharacterDrawer from './components/FoldingCharacterDrawer/index.vue';
import ExpandCharacterList from './components/ExpandCharacterList/index.vue';
import Talents from './components/Talents/index.vue';

import { sidebarStack } from './index';
import { computed } from 'vue';

const { stack } = sidebarStack;

const components: Record<string, any> = {
  folding: FoldingCharacterDrawer,
  expand: ExpandCharacterList,
  talents: Talents
};

const current = computed(() => components[stack[stack.length - 1] || '']);
</script>
<template>
  <Transition name="switch">
    <KeepAlive>
      <component :is="current" />
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
