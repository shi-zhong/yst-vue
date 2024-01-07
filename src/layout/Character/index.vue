<script setup lang="ts">
import { ClassNameFactor } from '@/utils/className';
import { computed, watchEffect } from 'vue';
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';

import { Button } from '@shi-zhong/genshin-ui';

import type { Menu } from './interface';

import TalentsLeft from './components/Talents/TalentsLeft.vue';
import TalentsRight from './components/Talents/TalentsRight.vue';

import LivesLeft from './components/Lives/LivesLeft.vue';
import LivesRight from './components/Lives/LivesRight.vue';

import TeamChoose from './components/Teamchoose/index.vue';

import { Sound } from '@/utils/sound';

const S = ClassNameFactor('character-page-');

const store = useCharacterLayoutStore();

const props = withDefaults(
  defineProps<{
    title?: string;
    menu: Menu[];
    right?: Record<
      string,
      {
        fc: any;
        binding?: Record<string, any>;
      }
    >;
    content?: {
      left?: string[];
      right?: string[];
      fc: any;
      binding?: Record<string, any>;
    }[];
  }>(),
  {
    title: '角色配置',
    right: () => ({}),
    content: () => []
  }
);

const emits = defineEmits<{
  (e: 'quit'): void;
}>();

const builtInLeft: Record<string, any> = {
  talents: TalentsLeft,
  lives: LivesLeft
};

const builtInRight: Record<
  string,
  {
    fc: any;
    binding?: Record<string, any>;
  }
> = {
  talents: {
    fc: TalentsRight,
    binding: {}
  },
  lives: {
    fc: LivesRight,
    binding: {}
  }
};

watchEffect(() => {
  document.title = props.title;
});

const cContent = computed(() =>
  props.content.find((f) => {
    return (
      (!f.left || !f.left.length || f.left.includes(store.sidebar)) &&
      (!f.right || !f.right.length || f.right.includes(store.cRight))
    );
  })
);

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
            v-if="!['talents', 'lives'].includes(store.sidebar)"
            type="spread"
            :icon="store.sidebar === '' ? 'close' : 'back'"
            @click="
              () => {
                Sound.winClose.replay();
                if (store.sidebar) {
                  store.popSidebar();
                } else {
                  emits('quit');
                }
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
                :is="cContent?.fc"
                v-bind="cContent?.binding"
                @click.stop="() => {}"
              />
            </KeepAlive>
          </Transition>
        </div>
        <div :class="S('content-right')">
          <Transition name="switchR">
            <KeepAlive>
              <component
                :is="cRight?.fc"
                v-bind="cRight?.binding"
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
