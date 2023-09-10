<script setup lang="ts">
import TalentA from '@/assets/skills/bow_attack.png';
import TalentB from '@/assets/skills/yoimiya/lives/constellation_3.png';
import TalentC from '@/assets/skills/yoimiya/lives/constellation_5.png';
import TalentD from '@/assets/skills/yoimiya/talent_4.png';
import TalentE from '@/assets/skills/yoimiya/talent_5.png';
import TalentF from '@/assets/skills/yoimiya/talent_6.png';

import { useCharacterStateStore } from '@/stores/Character/CharacterState';

import { ClassNameFactor, EventDispatch } from '@/utils';
import { ref } from 'vue';

const S = ClassNameFactor('talents-');

const talents = [
  {
    name: '普通攻击·烟火打杨',
    lvl: 9,
    icon: TalentA
  },
  {
    name: '焰硝庭火舞',
    lvl: 9,
    icon: TalentB
  },
  {
    name: '琉金云间草',
    lvl: 6,
    icon: TalentC
  },
  {
    name: '袖火百景图',
    lvl: 1,
    icon: TalentD
  },
  {
    name: '炎昼风物诗',
    lvl: 1,
    icon: TalentE
  },
  {
    name: '炎色配比法',
    lvl: 1,
    icon: TalentF
  }
];

const select = ref(-1);

const stateStore = useCharacterStateStore();

const clickOutsideToClose = () => {
  if (stateStore.sidebar.state === 'talents') {
    stateStore.sidebar.next('back');
  }
  document.removeEventListener('click', clickOutsideToClose);
  select.value = -1;
};

const handleClick = (e: Event) => {
  EventDispatch(e, {
    skill: (dataset) => {
      e.stopPropagation();
      if (select.value === -1 && dataset.index) {
        document.addEventListener('click', clickOutsideToClose);
        stateStore.sidebar.next('talents');
      }
      select.value = parseInt(dataset.index || '-1');
    }
  });
};
</script>

<template>
  <div
    :class="S('content-right')"
    data-type="talent-right"
    @click="handleClick"
  >
    <div :class="S('box')">
      <button
        v-for="(i, index) in talents"
        :key="index"
        :class="
          S({
            cell: true,
            select: index === select
          })
        "
        data-type="skill"
        :data-index="index"
      >
        <div :class="S('event-area')">
          <div :class="S('text')">
            {{ i.name }}
            <br />
            Lv.{{ i.lvl }}
          </div>
          <img
            :draggable="false"
            :class="S('icon')"
            :src="i.icon"
            alt=""
          />
        </div>
      </button>
    </div>
    <div
      v-show="select === -1"
      :class="S('extra')"
    >
      选中战斗天赋以升级
    </div>
  </div>
</template>

<style scoped lang="less">
.talents {
  &-content-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    height: 100%;
  }

  &-box {
    width: 100%;
    overflow: hidden;
    padding-right: 100px;
  }

  &-cell {
    width: 100%;
    border: none;
    background-color: transparent;

    display: flex;
    flex-direction: row-reverse;

    transition: 0.3s;

    opacity: 0.8;
  }

  &-select {
    transform: scale(1.15) translateX(-24px);
    opacity: 1;
  }

  &-event-area {
    display: flex;
    align-items: center;
    justify-content: end;

    height: 100px;

    font-size: 20px;
    color: @blank-white;
    text-align: right;

    transition: 0.3s;

    &:active {
      transform: scale(1.1);
    }
  }

  &-select &-event-area:active {
    transform: none;
  }

  &-text {
    text-align: right;
    padding-right: 10px;
  }

  &-icon {
    height: 100%;
    vertical-align: top;
  }

  &-extra {
    margin: 50px 120px;

    color: white;
    font-size: 20px;
    opacity: 0.8;
    user-select: none;
  }
}
</style>
