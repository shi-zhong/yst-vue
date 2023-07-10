<script setup lang="ts">
import { ScrollView, Button, Line } from '@/components';
import { ClassNameFactor } from '@/utils';
import { ref } from 'vue';

const elements = [
  { txt: '火元素' },
  { txt: '水元素' },
  { txt: '草元素' },
  { txt: '雷元素' },
  { txt: '风元素' },
  { txt: '冰元素' },
  { txt: '岩元素' }
];

const weapons = [
  { txt: '单手剑' },
  { txt: '双手剑' },
  { txt: '弓' },
  { txt: '长柄武器' },
  { txt: '法器' }
];

const S = ClassNameFactor('filter-');

const elementSelect = ref<string[]>([]);
const weaponSelect = ref<string[]>([]);
</script>

<template>
  <div :class="S()">
    <div :class="S('header')">筛选</div>
    <Line />
    <div :class="S('list')">
      <ScrollView
        :class="S('root')"
        scrollbar
        slide
      >
        <div :class="S('option-list')">
          <label
            v-for="element in elements"
            :key="element.txt"
            :class="
              S({
                'muti-option': true,
                select: elementSelect.includes(element.txt)
              })
            "
          >
            <input
              type="checkbox"
              :class="S('checkbox')"
              name="element"
              :value="element.txt"
              v-model="elementSelect"
            />
            {{ element.txt }}
          </label>
        </div>
        <div :class="S('option-list')">
          <label
            v-for="weapon in weapons"
            :key="weapon.txt"
            :class="
              S({
                'muti-option': true,
                select: weaponSelect.includes(weapon.txt)
              })
            "
          >
            <input
              type="checkbox"
              :class="S('checkbox')"
              name="element"
              :value="weapon.txt"
              v-model="weaponSelect"
            />
            {{ weapon.txt }}
          </label>
        </div>
      </ScrollView>
      <div>
        
      </div>
    </div>
    <div :class="S('options')">
      <Button
        type="shrink"
        @click="() => {}"
        icon="round"
        >确认筛选
      </Button>
    </div>
  </div>
</template>

<style scoped lang="less">
@import url(../../../../index.less);
.filter {
  &- {
    .sidebar();
    // width: 430px;
    background: @fontdarkgray;

    padding: 0 20px;
    box-sizing: border-box;

    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }
  &-header {
    height: 60px;
    flex-shrink: 0;
    color: rgb(211, 189, 142);

    margin-top: 20px;

    font-size: 30px;
    user-select: none;

    display: flex;
    align-items: center;
  }

  &-option-list {
    // display: flex;
  }

  &-checkbox {
    display: none;
  }

  &-muti-option {
    position: relative;
    display: inline-block;
    width: 45%;
    height: 80px;
    line-height: 80px;
    padding-left: 50px;
    font-size: 20px;
    box-sizing: border-box;
    margin: 10px;

    border: 1px solid @fontlightgray;
    border-radius: 4px;

    cursor: inherit;

    color: @blank-white;

    &::before {
      content: '';
      // common
      display: block;
      border: 2px solid @fontlightgray;

      // not select
      height: 20px;
      width: 20px;

      border-radius: 50%;
      position: absolute;
      left: 10px;
      top: 50%;

      transform-origin: 10px 5px;
      transform: translateY(-50%);
    }
  }

  &-select {
    background-color: @blank-white;
    color: @fontdarkgray;
    &::before {
      content: '';
      display: block;
      width: 20px;
      height: 10px;

      border: 5px solid @selected-border;
      border-top: transparent;
      border-right: transparent;
      border-radius: 3px;

      transform: translateY(-50%) rotate(-45deg);
    }

    &::after {
    }
  }

  &-list {
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
  }

  &-root {
    height: 100%;
  }

  &-options {
    flex-shrink: 0;
    margin: 20px 0;
  }
}
</style>
