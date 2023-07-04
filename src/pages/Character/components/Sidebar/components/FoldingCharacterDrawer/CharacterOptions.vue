<script setup lang="ts">
import { ref } from 'vue';
import { ClassNameFactor, EventDispatch } from '@/utils';
import { useCharacterStore } from '@/stores/Character';

// 用于应用按下但未松开时样式展示
const press = ref(-1);

const S = ClassNameFactor('options-');

const stores = useCharacterStore();

const handleClick = (e: Event) => {
  EventDispatch(e, {
    item: (dataset) => {
      stores.setOption(parseInt(dataset.index || '0'));
    }
  });
  press.value = -1;
};

const options = ['属性', '武器', '圣遗物', '命之座', '天赋', '资料'];

</script>

<template>
  <div
    :class="S('list')"
    data-type="list"
    @click="handleClick"
  >
    <div
      v-for="(option, index) in options"
      :class="
        S({
          item: true,
          'item-not-active': index !== stores.crtOption && index !== press,
          'item-active': index === stores.crtOption
        })
      "
      :key="option"
      data-type="item"
      :data-index="index"
    >
      {{ option }}
    </div>
  </div>
</template>

<style scope lang="less">
.options {
  &-list {
    margin: 30px;
    color: @blank-white;
    font-size: 25px;
  }

  &-item {
    position: relative;

    height: 50px;
    padding-left: 50px;
    margin: 30px 10px;

    border: 2px solid transparent;
    border-right: none;

    line-height: 50px;

    box-sizing: content-box;
    transition: 0.2s;
    opacity: 0.8;

    &:hover {
      border-radius: 25px 0 0 25px;
      border: 2px solid rgba(109, 109, 109, 0.3);
      border-right: none;
    }

    &::before {
      content: '';
      transition: 0.3s;
    }

    &-active {
      padding-left: 60px;
      font-size: 30px;
      opacity: 1;

      &::before {
        content: '';

        position: absolute;
        top: 50%;
        left: 15%;

        width: 18px;
        height: 18px;
        border: 2px solid rgb(208, 208, 208);

        display: block;

        transform: translate(-50%, -50%) rotate(45deg);
        opacity: 0.5;
      }

      &::after {
        content: '';

        position: absolute;
        top: 50%;
        left: 15%;

        display: inline-block;

        border: 5px solid @blank-white;
        border-left-color: transparent;
        border-bottom-color: transparent;
        border-radius: 1px;

        animation: movement 1s infinite ease;
        transform: translate(-50%, -50%) rotate(45deg);
      }
    }

    &-not-active:active {
      &::before {
        content: '';

        position: absolute;
        top: 50%;
        left: 15%;

        width: 18px;
        height: 18px;
        border: 2px solid rgb(208, 208, 208);

        display: block;

        transform: translate(-50%, -50%) rotate(45deg);
        opacity: 0.5;
      }

      &::after {
        content: '';

        position: absolute;
        top: 50%;
        left: 15%;

        display: inline-block;

        border: 5px solid @blank-white;
        border-radius: 1px;

        transform: translate(-50%, -50%) rotate(45deg);
      }
    }

    &-not-active {
      &::before {
        content: '';

        position: absolute;
        top: 50%;
        left: 15%;

        width: 28px;
        height: 28px;

        display: block;

        transform: translate(-50%, -50%) rotate(45deg);
      }

      &::after {
        content: '';

        position: absolute;
        top: 50%;
        left: 15%;

        transform: translate(-50%, -50%) rotate(45deg);

        display: inline-block;

        border: 5px solid @blank-white;
        border-radius: 1px;
      }
    }
  }
}
</style>
