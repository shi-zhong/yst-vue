<script setup lang="tsx">
import { reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCharacterStore } from '@/stores/Character';

import { ClassNameFactor, EventDispatch, GetElementPicture, merge } from '@/utils';
import { type CharacterInstanceBasicModel } from '@/interface/characters';
import { Button, ScrollView } from '@/components';
import CharacterOptions from './CharacterOptions.vue';
import { sidebarStack } from '../../index';

import Menu from '@/assets/icons/menu.png';
import RankPicture from './rank_star.png';

interface CharacterBoxProps {
  avatar: string;
  dataKey: number;
  dataIndex: number;
  inteam?: boolean;
}

const store = useCharacterStore();
const { list, team, active } = storeToRefs(store);

const S = ClassNameFactor('folding-character-drawer-');

const current = reactive({
  element: '风',
  name: '荧'
} as CharacterInstanceBasicModel);

const CharacterBox = (props: CharacterBoxProps) => {
  const { avatar, dataKey, dataIndex, inteam } = props;
  return (
    <div
      class={S({
        'character-box': true,
        'character-inteam': inteam != undefined
      })}
      data-type="character-box"
      data-key={dataKey}
      data-index={dataIndex}
    >
      <img
        draggable={false}
        class={S('character-image')}
        key={avatar}
        src={avatar}
        alt=""
      />
    </div>
  );
};

watch(
  () => active,
  () => {
    const index = list.value.findIndex((i) => i.id === active.value);
    merge(current, list.value[index] || list.value[0]);
  }
);

// /**
//  * 从当前元素的自定义集合中寻找是否为委托对象，
//  * 不是则向上冒泡(查找父元素)
//  * 直至找到顶层元素(事件挂载元素)
//  */
const handleClickDispatch = (e: Event) => {
  EventDispatch(e, {
    'character-box': (dataset) => {
      list.value.findIndex((c) => {
        if (c.id === parseInt(dataset.key || '')) {
          merge(current, {
            element: c.element,
            name: c.name
          });
          store.setActive(parseInt(dataset.index || '') + 1);

          return true;
        }
      });
    }
  });
};

</script>

<template>
  <div class="box">
    <div :class="S()">
      <div :class="S('element')">
        <img
          :class="S('element-image')"
          :draggable="false"
          :src="GetElementPicture(current?.element || '火')"
          alt="element"
        />
      </div>

      <ScrollView
        :rootClass="S('list-clip')"
        :class="S('list')"
        scrollBehavior="hidden"
        slide
      >
        <div
          :class="S('active-tag')"
          :style="{ top: `${active * 100}px` }"
        >
          <img
            :class="S('active-star')"
            :src="RankPicture"
            alt="/"
          />
        </div>
        <div
          :class="S('list-true')"
          data-type="character-list"
          @click="handleClickDispatch"
        >
          <template
            v-for="(i, index) in list.filter((i) => team.find((j) => i.id === j))"
            :key="i.avatar + index + i.id"
          >
            <CharacterBox
              inteam
              :avatar="i.avatar"
              :dataKey="i.id"
              :dataIndex="index"
            />
          </template>
          <template
            v-for="(i, index) in list.filter((i) => !team.find((j) => i.id === j))"
            :key="i.avatar + (index + team.length) + i.id"
          >
            <CharacterBox
              :avatar="i.avatar"
              :dataKey="i.id"
              :dataIndex="team.length + index"
            />
          </template>
        </div>
      </ScrollView>

      <div :class="S('menu-container')">
        <Button
          type="spread"
          @click="
            () => {
              sidebarStack.push('expand');
            }
          "
          :icon="Menu"
        >
        </Button>
      </div>
    </div>
    <div :class="S('options')">
      <div :class="S('element-and-name')">{{ current.element }}元素 / {{ current.name }}</div>
      <CharacterOptions />
    </div>
  </div>
</template>

<style scope lang="less">
@import url(../../index.less);
.box {
  .sidebar();
}
.folding-character-drawer {
  &- {
    width: 80px;
    height: 100vh;
    background: linear-gradient(@fontdarkgray, rgba(46, 83, 89, 0.6));
    display: inline-flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    user-select: none;
  }

  &-element {
    border: white;
    width: 64px;
    height: 80px;
    margin: 10px auto;

    &-image {
      width: 64px;
      height: 64px;
    }
  }

  &-list {
    position: relative;

    width: 160px;
    height: 100%;

    /*
    * 用 wrap 作为角色区域，内部list用绝对定位居中
    */
    &-clip {
      width: 150px;
      overflow: hidden;
      flex-grow: 1;
      flex-shrink: 1;
    }

    &-true {
      position: relative;
      z-index: 2;
      & :first-child {
        margin-top: 0;
      }
      & :last-child {
        margin-bottom: 0;
      }
    }
  }

  &-active {
    &-tag {
      overflow: visible;
      position: absolute;
      width: 115px;
      transition: 0.3s ease;
      z-index: 0;

      height: 70px;
      overflow: visible;
      border-radius: 0 32px 32px 0;
      background: @blank-white;
    }
    &-star {
      height: 35px;
      position: absolute;
      top: 50%;
      left: 100%;
      z-index: 0;
      transform: translateY(-50%);
    }
  }

  &-character {
    &-box {
      width: 64px;
      height: 64px;
      margin: 30px auto;
      border: 3px solid transparent;
      box-sizing: content-box;
      border-radius: 50%;

      line-height: 64px;
      text-align: center;

      overflow: hidden;
      background: @shadow;
    }

    &-inteam {
      background: @selected-bgc;
      border: 3px solid @selected-border;
      box-sizing: content-box;
    }

    &-image {
      width: 58px;
      vertical-align: bottom;
    }
  }

  &-menu-container {
    margin: 20px auto;
    width: 64px;
  }
}

.folding-character-drawer {
  &-options {
    width: 300px;
    height: 100vh;
    display: inline-block;
    vertical-align: top;
    user-select: none;
  }
  &-element-and-name {
    height: 80px;
    padding: 18px;
    line-height: 40px;

    color: rgb(211, 189, 142);
    font-size: x-large;
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
