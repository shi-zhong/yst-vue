<script setup lang="tsx">
import { EventDispatch } from '@/utils';
import { ClassNameFactor } from '@/utils';
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';

import ConstellationIcon from './ConstellaionIcon.vue';

import Life1 from '@/assets/skills/yoimiya/lives/constellation_1.png';

const S = ClassNameFactor('constellation-');

const store = useCharacterLayoutStore();

const clickOutsideToClose = () => {
  if (store.sidebar === 'lives') {
    store.popSidebar();
  }
  document.removeEventListener('click', clickOutsideToClose);
  store.setLives(-1);
};

const handleConstellationClick = (e: Event) => {
  EventDispatch(e, {
    constellation: (dataset) => {
      if (store.lives === -1) {
        document.addEventListener('click', clickOutsideToClose);
        store.pushSidebar('lives');
      }
      store.setLives(parseInt(dataset.index || ''));
    },
    'constellation-top': () => {
      clickOutsideToClose();
    }
  });
};

</script>

<template>
  <div
    :class="S('container')"
    @click="handleConstellationClick"
    data-type="constellation-top"
  >
    <div
      v-for="(i, index) in store.characterStatic?.life"
      :key="index"
      :class="S('box')"
      data-type="constellation"
      :data-index="index"
    >
      <ConstellationIcon
        :index="index + 1"
        :element="store.characterStatic?.basic.element!"
        :lock="store.character?.lives! <= index"
        :icon="Life1"
      >
      </ConstellationIcon>
      <div
        :class="S('text')"
        data-type="active"
        :data-index="index + 1"
      >
        {{ i.name }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
// 20r
@basic: calc(100vh - 300px);
// 22.6
@doubleradius: calc(@basic * 1.13);
// 2r
@min-height: calc(@basic * 0.1);

.constellation {
  &-container {
    height: @basic;
    margin-top: 50px;
    position: absolute;
    width: 100%;

    display: flex;
    flex-flow: column nowrap;
    justify-content: space-evenly;

    &::before {
      content: '';
      position: absolute;
      //
      left: calc(-1 * @min-height * 8.3);

      display: block;
      width: @doubleradius;
      height: @doubleradius;
      border: 2px solid rgba(255, 255, 255, 0.5);
      border-radius: 50%;
    }

    & > :nth-child(1),
    & > :nth-child(6) {
      transform: translateX(calc(@min-height * 0.1));
    }
    & > :nth-child(2),
    & > :nth-child(5) {
      transform: translateX(calc(@min-height * 1.2));
    }
    & > :nth-child(3),
    & > :nth-child(4) {
      transform: translateX(calc(@min-height * 1.6));
    }
  }
  &-box {
    position: relative;
    z-index: 1;

    height: @min-height;

    padding-left: 60px;

    overflow: hidden;

    font-size: 20px;
    color: @blank-white;
    user-select: none;
    &:active {
      background: radial-gradient(circle at center, rgba(0, 0, 0, 0.1), transparent);
    }
  }

  &-lock {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;

    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    & :first-child {
      display: block;
      width: 70%;
      margin: 15%;
    }
  }

  &-text {
    display: inline-block;
    padding-left: 30px;
  }
}
</style>
