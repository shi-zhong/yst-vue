<script setup lang="tsx">
import { EventDispatch } from '@/utils';
import { ClassNameFactor } from '@/utils';
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';

import ConstellationIcon from './ConstellaionIcon.vue';

import Life1 from '@/assets/skills/yoimiya/lives/constellation_1.png';
import Life2 from '@/assets/skills/yoimiya/lives/constellation_2.png';
import Life3 from '@/assets/skills/yoimiya/lives/constellation_3.png';
import Life4 from '@/assets/skills/yoimiya/lives/constellation_4.png';
import Life5 from '@/assets/skills/yoimiya/lives/constellation_5.png';
import Life6 from '@/assets/skills/yoimiya/lives/constellation_6.png';
import { ref } from 'vue';

const S = ClassNameFactor('constellation-');

const store = useCharacterLayoutStore();

const active = ref(-1);

const lifes = [
  {
    name: '赤团开时斜飞去',
    icon: Life1,
    intro: '处于蝶引来生施加的彼岸蝶舞状态下时，胡桃的重击不会消耗体力。'
  },
  {
    name: '最不安神晴又复雨',
    icon: Life2,
    intro:
      '血梅香造成的伤害提高，提高值相当于效果附加时胡桃生命值上限的10%。此外，安神秘法会为命中的敌人施加血梅香效果。'
  },
  {
    name: '逗留采血色',
    icon: Life3,
    intro: '蝶引来生的技能等级提升3级。至多提升至15级。'
  },
  {
    name: '伴君眠花房',
    icon: Life4,
    intro:
      '处于胡桃自己施加的血梅香状态影响下的敌人被击败时，附近的队伍中所有角色（不包括胡桃自己）的暴击率提高12%，持续15秒。'
  },
  {
    name: '无可奈何燃花作香',
    icon: Life5,
    intro: '安神秘法的技能等级提升3级。至多提升至15级。'
  },
  {
    name: '幽蝶能留一缕芳',
    icon: Life6,
    intro:
      '胡桃的生命值降至25%以下，或承受足以使她倒下的伤害时触发：此次伤害不会使胡桃倒下，并在接下来的10秒内，胡桃的所有元素抗性和物理抗性提高200%，暴击率提高100%，并极大地提高抗打断能力。这个效果在胡桃生命值为1时会自动触发。 该效果每60秒只能触发一次。'
  }
];

const clickOutsideToClose = () => {
  if (store.sidebar === 'lives') {
    store.popSidebar();
  }
  document.removeEventListener('click', clickOutsideToClose);
  active.value = -1;
};

const handleConstellationClick = (e: Event) => {
  EventDispatch(e, {
    constellation: (dataset) => {
      if (active.value === -1 && dataset.index) {
        document.addEventListener('click', clickOutsideToClose);
        active.value = parseInt(dataset.index || '');
        store.pushSidebar('lives');
      }
    },
    'constellation-top': () => {
      clickOutsideToClose();
    }
  });
};

const nowlife = 4;
</script>

<template>
  <div
    :class="S('container')"
    @click="handleConstellationClick"
    data-type="constellation-top"
  >
    <div
      v-for="(i, index) in lifes"
      :key="index"
      :class="S('box')"
      data-type="constellation"
      :data-index="index"
    >
      <ConstellationIcon
        :index="index + 1"
        element="fire"
        :lock="nowlife <= index"
        :icon="i.icon"
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
