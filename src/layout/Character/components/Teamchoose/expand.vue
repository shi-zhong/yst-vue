<script setup lang="ts">
import CharacterCard from '@/components/Cards/CharacterCard.vue';

import { ScrollView, Select, Button } from '@shi-zhong/genshin-ui';
import { ClassNameFactor } from '@/utils';
import type { CharacterInstanceExpandModel } from '@/interface';

import Character from '@/assets/icons/characters.webp';

defineProps<{
  team: CharacterInstanceExpandModel[];
  list: CharacterInstanceExpandModel[];
  selected: number;
}>();

const emits = defineEmits<{
  (e: 'toFilter'): void;
}>();

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
      <CharacterCard
        v-for="(ch, index) in team.concat(list)"
        :key="`${ch.character_id}/${ch.id}`"
        :selected="selected === ch.id"
        :element="ch.element"
        :eName="ch.eName"
        :star="ch.star"
        :lvl="ch.lvl"
        :inTeam="index < team.length"
      />
    </ScrollView>

    <div :class="S('options')">
      <Button
        type="shrink"
        shape="round"
        @click="() => emits('toFilter')"
        icon="filter"
      ></Button>
      <Select
        style="width: 250px"
        :options="options"
      ></Select>
      <Button
        type="shrink"
        shape="round"
        @click="() => {}"
        icon="sort"
      ></Button>
    </div>
  </div>
</template>

<style scoped lang="less">
.expand-character {
  &- {
    width: 500px;
    height: 100vh;
    max-height: 100vh;
    position: absolute;

    overflow: hidden;
    top: 0;

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
    margin: 0 35px;
    flex-grow: 1;
    flex-shrink: 1;
  }

  &-options {
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    margin: 20px 30px;
    z-index: 3;
  }
}
</style>
