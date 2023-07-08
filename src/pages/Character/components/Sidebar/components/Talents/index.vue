<script setup lang="ts">
import { Button } from '@/components';

import TalentA from '@/assets/skills/bow_attack.png';

import { ClassNameFactor } from '@/utils/className';
import Tabs from './Tabs.vue';

const S = ClassNameFactor('skills-');

const Talent = {
  type: '战斗天赋',
  icon: TalentA,
  name: '普通攻击·烟火打杨',
  lvl: 9
};
</script>

<template>
  <div :class="S()">
    <div :class="S('basic')">
      <div :class="S('talent-type')">
        {{ Talent.type }}
      </div>
      <img
        :class="S('talent-icon')"
        :src="Talent.icon"
        :draggable="false"
        alt=""
      />
      <div :class="S('talent-name')">
        {{ Talent.name }}
      </div>
      <div :class="S('talent-lvl')">Lv.{{ Talent.lvl }}</div>
    </div>
    <Tabs />
    <div :class="S('button-con')">
      <Button
        type="shrink"
        icon="fork"
        >降级
      </Button>
      <div :class="S('gap')"></div>
      <Button
        type="shrink"
        icon="round"
        >升级
      </Button>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '@@/HighLight/index.less';
@import '../../../../index.less';

.skills {
  &- {
    .sidebar();
    background: linear-gradient(180deg, @fontdarkgray, rgba(72, 85, 103, 0.7) ;);
    height: 100vh;
    width: 500px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }

  &-basic {
    text-align: center;
    padding: 20px;
    background: transparent;
    user-select: none;

    flex-shrink: 0;
  }

  &-talent {
    &-type {
      color: @highlight-spe;
    }
    &-icon {
      width: 80px;
    }

    &-name {
      color: @highlight-spe;
      font-size: 18px;
    }
    &-lvl {
      color: @blank-white;
    }
  }

  &-button-con {
    margin: 20px 0;
    padding: 20px;
    display: flex;
    flex-shrink: 0;
  }
  &-gap {
    width: 20px;
  }
}
</style>
