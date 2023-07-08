<script setup lang="ts">
import { ClassNameFactor } from '@/utils/className';
import { Button, HighLight, Line } from '@/components';
import TalentA from '@/assets/skills/yoimiya/talent_4.png';
import { ScrollView } from '@/components';
import Life1 from '@/assets/skills/yoimiya/lives/constellation_1.png';

import ConstellaionIcon from '../../../ContentRight/components/ConstellaionIcon.vue';

const S = ClassNameFactor('constellation-');

const Talent = {
  title: '出预留金',
  index: 3,
  icon: TalentA,
  name: '普通攻击·烟火打杨',
  lvl: 9
};
</script>

<template>
  <div :class="S()">
    <ConstellaionIcon
      :class="S('icon')"
      element="fire"
      :lock="false"
      :icon="Life1"
    />
    <Line />
    <ScrollView
      :rootClass="S('tab-item')"
      slide
    >
      <div :class="S('content')">
        <div :class="S('title')">出预留金</div>
        <div :class="S('sub-title')">
          命之座 第<span :class="S('number')"> {{ 1 }} </span>层
        </div>
        <div :class="S({ lock: true })">
          <HighLight text="$0琉金云间草$的鎏金火花持续时间延长至4秒。" />
        </div>
      </div>
    </ScrollView>
    <Line />
    <div :class="S('button-box')">
      <Button
        type="shrink"
        icon="round"
        >激活</Button
      >
    </div>
  </div>
</template>

<style scoped lang="less">
@import '@@/HighLight/index.less';
@import '../../../../index.less';

.constellation {
  &- {
    background: linear-gradient(180deg, @fontdarkgray, rgba(72, 85, 103, 0.7));
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    .sidebar();
  }

  &-icon {
    height: 60px;
    margin: 50px auto 30px auto;
    user-select: none;
    flex-shrink: 0;
  }

  &-tab-item {
    height: calc(100vh - 340px);
    margin: 10px 10px;
    font-size: 18px;
  }

  &-content {
    min-height: calc(100vh - 340px);
    margin: 0 30px;
    user-select: none;
    color: @blank-white;
    font-size: 22px;
  }

  &-title {
    color: @highlight-spe;
    font-size: 26px;
    padding-bottom: 15px;
  }

  &-sub-title {
    padding-bottom: 20px;
  }

  &-number {
    color: rgb(153, 254, 254);
  }

  &-lock {
    opacity: 0.8;
  }

  &-button-box {
    flex-shrink: 0;
    height: 65px;
    padding: 20px;
  }
}
</style>
