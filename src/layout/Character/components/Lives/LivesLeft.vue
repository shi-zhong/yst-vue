<script setup lang="ts">
import { ClassNameFactor } from '@/utils/className';
import { Button, HighLight, Line } from '@/components';
import { ScrollView } from '@/components';
import ConstellaionIcon from './ConstellaionIcon.vue';
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';
import { computed } from 'vue';

const S = ClassNameFactor('constellation-');

const store = useCharacterLayoutStore();

const live = computed(() => store.characterStatic?.lives[store.lives] || { name: '', desc: '' });
</script>

<template>
  <div :class="S()">
    <ConstellaionIcon
      :class="S('icon')"
      :element="store.characterStatic?.basic.element!"
      :lock="false"
      :life="store.lives + 1"
      :e-name="store.characterStatic?.basic.eName ?? ''"
    />
    <Line />
    <ScrollView
      :class="S('tab-item')"
      slide
    >
      <div :class="S('content')">
        <div :class="S('title')">{{ live.name }}</div>
        <div :class="S('sub-title')">
          命之座 第<span :class="S('number')"> {{ store.lives + 1 }} </span>层
        </div>
        <div :class="S({ lock: true })">
          <HighLight :text="live.desc" />
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

.constellation {
  &- {
    background: linear-gradient(180deg, @fontdarkgray, rgba(72, 85, 103, 0.7));
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    width: 500px;
    height: 100vh;
    max-height: 100vh;
    position: absolute;

    overflow: hidden;
    top: 0;
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
