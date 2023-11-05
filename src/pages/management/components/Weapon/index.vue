<script setup lang="ts">
import { ScrollView } from '@/components';
import { StarToMaxLevel, WeaponCard } from '@/components/Weapon';
import { ref } from 'vue';
import Editor from './editor.vue';
import { EventDispatch } from '@/utils';
import { useWeaponStore } from '@/stores/Weapon';
import { useConfig } from '@/stores/config';

const store = useWeaponStore();
const config = useConfig()

const activeData = ref(-1);

const handleActive = (e: Event) => {
  EventDispatch(e, {
    'weapon-card': (dataset) => {
      activeData.value = +dataset.key;
    }
  });
};
</script>

<template>
  <div class="title">武器</div>
  <div class="content">
    <ScrollView
      class="weapon-list"
      scroll-behavior="scroll"
      data-type="top"
      @click="handleActive"
    >
      <WeaponCard
        v-for="weapon of store.weaponTypes.values()"
        :key="weapon.id"
        data-type="weapon-card"
        :data-key="weapon.id"
        :imgUrl="weapon.basic.imgUrl"
        :lvl="StarToMaxLevel(weapon.basic.star)"
        :locked="true"
        :rarity="weapon.basic.star"
      />
    </ScrollView>
    <Editor
      class="weapon-right"
      :active="activeData"
      @change="(id: number) => activeData = id"
    />
  </div>
</template>

<style scoped lang="less">
.title {
  height: 80px;
  line-height: 80px;
  padding: 10px 40px;
  font-size: 30px;
  color: @fontdarkgray;
  box-shadow: 0 0 5px @fontlightgray;
}

.content {
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 100px);
}

.weapon-right {
  flex-grow: 1;
  flex-shrink: 1;
}

.weapon {
  &-list {
    margin: 0 30px;
    min-width: 530px;
    height: 100%;
  }
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    color: @blank-white;
    font-size: 25px;
    padding: 5px 10px;
  }
  &-line {
    background-color: @blank-white;
    box-shadow: 0px 0 4px @fontlightgray;
    border-radius: 5px;
    display: inline-block;
    width: 500px;
    overflow: hidden;
    margin: 10px 0;
    & img {
      width: 100px;
      height: 100px;
    }
    &:hover {
      border-color: transparent;
      box-shadow: 0px 0 8px @fontlightgray;
    }
  }
}

.bar {
  &-golden {
    background: @rank-golden-bar;
  }
  &-purple {
    background: @rank-purple-bar;
  }
  &-blue {
    background: @rank-blue-bar;
  }
  &-green {
    background: @rank-green-bar;
  }
  &-gray {
    background: @rank-gray-bar;
  }
}
</style>
