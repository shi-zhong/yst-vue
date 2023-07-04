<script setup lang="tsx">
import { ClassNameFactor } from '@/utils';

import Lock from '@/assets/icons/lock.png';

import Life1 from '@/assets/skills/yoimiya/lives/constellation_1.png';
import Life2 from '@/assets/skills/yoimiya/lives/constellation_2.png';
import Life3 from '@/assets/skills/yoimiya/lives/constellation_3.png';
import Life4 from '@/assets/skills/yoimiya/lives/constellation_4.png';
import Life5 from '@/assets/skills/yoimiya/lives/constellation_5.png';
import Life6 from '@/assets/skills/yoimiya/lives/constellation_6.png';

const S = ClassNameFactor('constellation-');

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

const nowlife = 2;

const ConstellationIcon = (props: {
  lock: boolean;
  icon: string;
  element: string;
  index?: number;
}) => (
  <div
    class={S(['icon', props.element])}
    data-type="active"
    data-index={props.index || 0}
  >
    <img
      draggable={false}
      class={S('life')}
      src={props.icon}
      alt=""
    />
    {props.lock && (
      <div class={S('lock')}>
        <img
          draggable={false}
          src={Lock}
          alt=""
        />
      </div>
    )}
  </div>
);
</script>

<template>
  <div :class="S('container')">
    <div
      v-for="(i, index) in lifes"
      :key="index"
      :class="S({ box: true, locked: nowlife <= index })"
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

<style scope lang="less">
@basic: calc(100vh - 300px);
@radius: calc(@basic * 1.27);
@min-height: calc(@basic * 0.025);

.constellation {
  &-container {
    height: @basic;
    margin-top: 50px;
    padding: @min-height 0;
    position: relative;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      top: -13.5%;
      left: calc(-1 * @basic * 1.03);

      display: block;
      width: @radius;
      height: @radius;
      border: 2px solid rgba(255, 255, 255, 0.5);
      border-radius: 50%;
    }

    & > :nth-child(1),
    & > :nth-child(6) {
      margin-left: calc(@basic * 0.4 * 0.15);
    }
    & > :nth-child(2),
    & > :nth-child(5) {
      margin-left: calc(@basic * 0.4 * 0.37);
    }
    & > :nth-child(3),
    & > :nth-child(4) {
      margin-left: calc(@basic * 0.4 * 0.47);
    }
  }
  &-box {
    position: relative;
    z-index: 1;

    height: calc(@min-height * 4);
    line-height: calc(@min-height * 4);
    margin: calc(@min-height * 2) 0;

    overflow: hidden;

    font-size: 20px;
    color: @blank-white;
    user-select: none;
    &:active {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  &-icon {
    position: relative;

    display: inline-block;
    height: 100%;
    aspect-ratio: 1;

    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    border: 3px solid transparent;
    box-sizing: border-box;

    vertical-align: middle;
    overflow: hidden;
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

  &-life {
    display: block;
    height: 100%;

    border-radius: 50%;
  }

  &-locked &-life {
    border-color: transparent;
  }

  &-fire {
    border-color: rgb(238, 121, 80);
  }

  &-locked&-fire {
    border-color: rgb(95, 34, 25);
  }

  &-water {
    border-color: rgb(25, 201, 235);
  }

  &-locked&-water {
    border-color: rgb(18, 75, 125);
  }

  &-elec {
    border-color: rgb(230, 155, 248);
  }

  &-locked&-elec {
    border-color: rgb(80, 44, 121);
  }

  &-ice {
    border-color: rgb(168, 243, 247);
  }

  &-locked&-ice {
    border-color: rgb(52, 103, 121);
  }

  &-grass {
    border-color: rgb(188, 241, 26);
  }

  &-locked > &-grass {
    border-color: rgb(62, 93, 29);
  }

  &-wind {
    border-color: rgb(78, 246, 219);
  }

  &-locked&-wind {
    border-color: rgb(28, 90, 75);
  }

  &-stone {
    border-color: rgb(254, 247, 64);
  }

  &-locked&-stone {
    border-color: rgb(109, 75, 22);
  }
}
</style>
