<script setup lang="ts">
import { ref } from 'vue';
import { ClassNameFactor, EventDispatch } from '@/utils';
import { useCharacterStateStore } from '@/stores/Character';
import { type ContentRightNames } from '@/pages/Character/interface';

// 用于应用按下但未松开时样式展示
const press = ref(-1);

const S = ClassNameFactor('options-');

const stores = useCharacterStateStore();

const handleClick = (e: Event) => {
  EventDispatch(e, {
    item: (dataset) => {
      stores.setContentRight(dataset.url as ContentRightNames);
    }
  });
  press.value = -1;
};

const options = [
  { txt: '属性', url: 'attr' },
  { txt: '武器', url: 'weapon' },
  { txt: '圣遗物', url: 'artifact' },
  { txt: '命之座', url: 'life' },
  { txt: '天赋', url: 'talents' },
  { txt: '资料', url: 'data' }
];
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
          'item-not-active': option.url !== stores.cRight && index !== press,
          'item-active': option.url === stores.cRight
        })
      "
      :key="option.url"
      data-type="item"
      :data-url="option.url"
    >
      {{ option.txt }}
    </div>
  </div>
</template>

<style scoped lang="less">
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

@keyframes movement {
  0% {
    margin-bottom: 0px;
    margin-left: 0px;
  }

  50% {
    margin-bottom: 4px;
    margin-left: 4px;
  }

  100% {
    margin-bottom: 0px;
    margin-left: 0px;
  }
}
</style>
