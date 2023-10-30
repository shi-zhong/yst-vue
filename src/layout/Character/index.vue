<script setup lang="ts">
import { ClassNameFactor } from '@/utils/className';
import { computed, watch, watchEffect } from 'vue';
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';
import { Button } from '@/components';
import type { Menu } from './interface';

import TalentsLeft from './components/Talents/TalentsLeft.vue';
import TalentsRight from './components/Talents/TalentsRight.vue';

import LivesLeft from './components/Lives/LivesLeft.vue';
import LivesRight from './components/Lives/LivesRight.vue';

import TeamChoose from './components/Teamchoose/index.vue';

import Back from '@/assets/icons/back.png';
import Close from '@/assets/icons/close.png';
import { Sound } from '@/utils/sound';

const S = ClassNameFactor('character-page-');

const store = useCharacterLayoutStore();

const props = withDefaults(
  defineProps<{
    title?: string;
    menu: Menu[];
    right?: Record<string, any>;
    content?: {
      left?: string[];
      right?: string[];
      fc: any;
    }[];
  }>(),
  {
    title: '角色配置',
    right: () => ({}),
    content: () => []
  }
);

const builtInLeft: Record<string, any> = {
  talents: TalentsLeft,
  lives: LivesLeft
};

const builtInRight: Record<string, any> = {
  talents: TalentsRight,
  lives: LivesRight
};

watchEffect(() => {
  document.title = props.title;
});

const cContent = computed(() => {
  const find = props.content.find((f) => {
    return (
      (!f.left || !f.left.length || f.left.includes(store.sidebar)) &&
      (!f.right || !f.right.length || f.right.includes(store.cRight))
    );
  });

  return find?.fc;
});
const cLeft = computed(() => builtInLeft[store.sidebar] || TeamChoose);
const cRight = computed(() => props.right[store.cRight] || builtInRight[store.cRight]);
</script>

<template>
  <div :class="S()">
    <Transition name="switchL">
      <KeepAlive>
        <component
          :is="cLeft"
          @click.stop="() => {}"
          :menu="menu"
        />
      </KeepAlive>
    </Transition>
    <div :class="S('sidecontent')">
      <div :class="S('header-')">
        <div :class="S('header-back-buttons')">
          <Button
            type="spread"
            :icon="Back"
            @click="
              () => {
                Sound.winClose.replay();
                store.popSidebar();
              }
            "
          ></Button>
        </div>
      </div>
      <div :class="S('content')">
        <div :class="S('content-left')">
          <Transition name="switchD">
            <KeepAlive>
              <component
                :is="cContent"
                @click.stop="() => {}"
              />
            </KeepAlive>
          </Transition>
        </div>
        <div :class="S('content-right')">
          <Transition name="switchR">
            <KeepAlive>
              <component
                :is="cRight"
                @click.stop="() => {}"
              />
            </KeepAlive>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '@@@/transition.less';
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

  &-header {
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

  &-content-left {
    flex-grow: 1;
  }
  &-content-right {
    position: relative;
    overflow: hidden;
    width: 500px;
    height: 100%;
    flex-shrink: 0;
  }
}
</style>
