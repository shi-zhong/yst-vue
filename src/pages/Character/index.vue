<script setup lang="ts">
import { ClassNameFactor } from '@/utils/className';

import Headers from './components/Header/index.vue';
import ContentRight from './components/ContentRight/index.vue';
import Sidebar from './components/Sidebar/index.vue';

import { ArtifactCard, ArtifactDetailCard } from '@/components/Artifact';
import Artifact from '@/assets/artifacts/five/wanderers_troupe/wanderers_troupe_goblet.png';

const S = ClassNameFactor('character-page-');

const data = {
  main: {
    key: 'any',
    value: '13.7%'
  },
  subs: [
    {
      key: '暴击伤害',
      value: '7.0%'
    },
    {
      key: '暴击伤害',
      value: '7.0%'
    },
    {
      key: '暴击伤害',
      value: '7.0%'
    },
    {
      key: '暴击伤害',
      value: '8.0%'
    }
  ]
};
</script>

<template>
  <div :class="S()">
    <Sidebar />
    <div :class="S('sidecontent')">
      <Headers />
      <div :class="S('content')">
        <div :class="S('content-left')">
          <ArtifactCard
            :locked="false"
            :rarity="5"
            :imgUrl="Artifact"
            :lvl="20"
          />
          <ArtifactDetailCard
            type="PlumnOfDeath"
            :subs="data.subs"
            :id="1638"
            :main="data.main"
            :sub="data.main"
            :suitCount="2"
            :lock="false"
            :rarity="5"
            :lvl="20"
          />
        </div>
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
