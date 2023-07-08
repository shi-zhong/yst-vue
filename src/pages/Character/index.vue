<script setup lang="ts">
import { ClassNameFactor } from '@/utils/className';

import Headers from './components/Header/index.vue';
import ContentRight from './components/ContentRight/index.vue';

import Sidebar from './components/Sidebar/index.vue';

const S = ClassNameFactor('character-page-');
</script>

<template>
  <div :class="S()">
    <Sidebar />
    <div :class="S('sidecontent')">
      <Headers />
      <div :class="S('content')">
        <div :class="S('content-left')"></div>
        <div :class="S('content-right')">
          <ContentRight />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
:deep(.blank-color) {
  color: rgb(237, 229, 216);
  height: 200px;
  width: 300px;
  user-select: none;
  // overflow: hidden;
}

.character-page {
  &- {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: darkcyan;

    display: flex;
  }

  &-sidecontent {
    display: inline-block;
    margin-left: 500px;
    width: 100%;
  }

  &-content {
    display: flex;
    height: calc(100vh - 100px);
  }

  &-content-left {
    flex-grow: 1;
  }
  &-content-right {
    position: relative;
    overflow: hidden;
    width: 500px;
    height: 100%;
  }
}
</style>
