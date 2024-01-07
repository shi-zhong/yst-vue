<script setup lang="ts">
import { Button, RankBar, ScrollView, Lock, Rarity } from '@shi-zhong/genshin-ui';

const decideMax = (rank: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
  return [20, 40, 50, 60, 70, 80, 90][rank];
};

const data = {
  type: 'bow',
  lock: true,
  main: { key: '基础攻击力', value: '674' },
  sub: { key: '暴击率', value: '22.1%' }
};
</script>

<template>
  <div class="basiw-data-container">
    <ScrollView style="flex-grow: 1">
      <div class="w-name">天空之翼</div>
      <div class="w-type">
        <span>{{ data.type }}</span>
        <Lock
          :size="30"
          lock
        />
      </div>
      <div class="w-line">
        <span>{{ data.main.key }}</span
        ><span>{{ data.main.value }}</span>
      </div>
      <div class="w-line">
        <span>{{ data.sub.key }} </span><span>{{ data.sub.value }}</span>
      </div>
      <Rarity
        style="display: block; margin: 10px 5px"
        :size="30"
        :rarity="5"
      />
      <div class="w-lvl">
        <div><span>Lv.80 </span><span>/ 90</span></div>
        <RankBar
          class="w-rankbar"
          :size="30"
          :rank="6"
        />
      </div>
      <div>精炼</div>
      <div></div>
      <div></div>
    </ScrollView>
    <div class="button">
      <Button
        type="shrink"
        class="button-line"
        sound="dong"
      >
        替换
      </Button>
      <Button
        type="shrink"
        class="button-line"
        sound="dong"
      >
        强化
      </Button>
    </div>
  </div>
</template>

<style scoped lang="less">
.basiw-data-container {
  height: 100%;
  padding: 40px 0;
  box-sizing: border-box;
  margin: 0 120px 0 50px;

  color: @blank-white;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.w {
  &-name {
    font-size: 30px;
  }
  &-type {
    display: flex;
    width: 100%;
    justify-content: space-between;
    font-size: 20px;
    line-height: 42px;
    color: rgba(255, 255, 255, 0.7);
  }
  &-line {
    margin: 5px 0;
    padding: 5px 10px;
    width: 100%;
    box-sizing: border-box;
    border-radius: 2px;
    font-size: 22px;

    background-color: rgba(255, 255, 255, 0.1);

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-lvl {
    display: flex;
    justify-content: start;
    align-items: center;

    & > :first-child {
      font-size: 20px;
      padding: 0 2px;
      margin-right: 5px;
      border-radius: 2px;
      background-color: rgba(0, 0, 0, 0.3);
      & :last-child {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

.w-rankbar {
  margin: 5px 0;
}

.w-lvl {
  font-size: 26px;
  &-max {
    color: rgba(255, 255, 255, 0.5);
  }
}

.button {
  display: flex;
  justify-content: space-between;

  &-line {
    transition: 0.2s all;
    width: 48%;
  }
}
</style>
