<script setup lang="ts">
import { ClassNameFactor } from '@/utils/className';
import { Button } from '@/components';

import { sidebarStack } from '../Sidebar/index';

import Back from '@/assets/icons/back.svg';
import Close from '@/assets/icons/close.svg';

const S = ClassNameFactor('character-page-header-');

const { stack } = sidebarStack;
</script>

<template>
  <div :class="S()">
    <div :class="S('back-buttons')">
      <Button
        v-if="stack.length > 2"
        type="spread"
        :icon="Back"
        @click="() => {}"
        :size="50"
      ></Button>
      <Button
        v-if="stack.length === 2"
        type="spread"
        :icon="Close"
        @click="
          () => {
            sidebarStack.pop();
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
