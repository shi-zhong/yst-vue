<script setup lang="ts">
import { useCharacterDataStore, useCharacterStateStore } from '@/stores/Character';
import { ScrollView, Select, Button, CharacterCard } from '@/components';
import { ClassNameFactor } from '@/utils';

import Character from '@/assets/icons/characters.webp';
import Filter from '@/assets/icons/filter.svg';
import Sort from '@/assets/icons/sort-line.svg';

import { storeToRefs } from 'pinia';

const store = useCharacterDataStore();
const stateStore = useCharacterStateStore();

const options = [
  { text: '等级顺序', value: '1' },
  { text: '品质顺序', value: '2' },
  { text: '命之座解锁层数顺序', value: '3' },
  { text: '好感度顺序', value: '4' },
  { text: '生命值上限顺序', value: '5' },
  { text: '攻击力顺序', value: '6' },
  { text: '防御力顺序', value: '7' },
  { text: '元素精通顺序', value: '8' }
];

const S = ClassNameFactor('expand-character-');

const { list } = storeToRefs(store);
const { team } = storeToRefs(stateStore);
</script>

<template>
  <div :class="S()">
    <div :class="S('header')">
      <div :class="S('character-card')">
        <img
          :class="S('character-card-image')"
          :draggable="false"
          :src="Character"
          alt="character"
        />
      </div>
      角色选择
    </div>

    <ScrollView
      :class="S('list')"
      scrollbar
      slide
    >
      <template
        v-for="(i, index) in list.filter((x) => team.find((j) => x.id === j))"
        :key="i.avatar + index"
      >
        <CharacterCard
          v-bind="i"
          selected
          :imgurl="i.avatar"
        />
      </template>

      <template
        v-for="(i, index) in list.filter((x) => !team.find((j) => x.id === j))"
        :key="i.avatar + index"
      >
        <CharacterCard
          v-bind="i"
          :imgurl="i.avatar"
        />
      </template>
    </ScrollView>

    <div :class="S('options')">
      <Button
        type="shrink"
        shape="round"
        @click="() => {}"
        :icon="Filter"
      ></Button>
      <Select
        :class="S('select')"
        :options="options"
      ></Select>
      <Button
        type="shrink"
        shape="round"
        @click="() => {}"
        :icon="Sort"
      >
      </Button>
    </div>
  </div>
</template>

<style scoped lang="less">
@import url(../../../../index.less);
.expand-character {
  &- {
    .sidebar();
    width: 430px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }
  &-header {
    height: 100px;
    flex-shrink: 0;
    color: rgb(211, 189, 142);
    padding: 20px 0;
    font-size: 20px;
    user-select: none;

    display: flex;
    align-items: center;
  }
  &-character-card {
    position: relative;

    display: inline-block;
    width: 60px;
    height: 75px;

    margin: 0 20px;
    border-radius: 5px;
    box-sizing: content-box;

    transform: scale(0.8) rotate(-6deg);

    background: rgb(211, 189, 142);

    &::before {
      content: '';
      position: absolute;
      display: block;
      border: 1px solid black;
      width: 48px;
      height: 63px;
      margin: 5px;

      opacity: 0.3;
    }

    &-image {
      width: 50px;
      margin: 10px 5px;
      filter: brightness(0.9);
    }
  }

  &-list {
    flex-grow: 1;
    flex-shrink: 1;
  }

  &-select {
    width: 250px;
  }

  &-options {
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    margin: 20px;
  }
}
</style>
