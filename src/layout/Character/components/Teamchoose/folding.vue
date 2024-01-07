<script setup lang="tsx">
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';
import { ClassNameFactor, EventDispatch, GetElementPicture } from '@/utils';
import { ImageSrc } from '@/components';
import { Button, ScrollView, Menu } from '@shi-zhong/genshin-ui';
import AvatarSideNone from '@/assets/icons/Side_None.png';

import RankPicture from './rank_star.png';
import type { ElementsChinese, CharacterInstanceExpandModel } from '@/interface';
import type { Menu as TMenu } from '../../interface';
import { useConfig } from '@/stores/config';
import { ref, watchEffect } from 'vue';

withDefaults(
  defineProps<{
    menu: TMenu[];
    current: { element: ElementsChinese; name: string };
    team: CharacterInstanceExpandModel[];
    list: CharacterInstanceExpandModel[];
    canExpand?: boolean;
    active: number;
  }>(),
  {
    canExpand: true
  }
);

const emits = defineEmits<{
  (e: 'toExpand'): void;
}>();

interface CharacterBoxProps {
  avatar: string;
  dataKey: number;
  dataIndex: number;
  inteam?: boolean;
}

const store = useCharacterLayoutStore();
const config = useConfig();

const S = ClassNameFactor('folding-character-drawer-');

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
      style={{ backgroundImage: `url(${avatar || AvatarSideNone})` }}
    ></div>
  );
};

const handleClickDispatch = (e: Event) => {
  EventDispatch(e, {
    'character-box': (dataset) => {
      store.setSelect(Number(dataset.key));
    }
  });
};

const handleAvatarUrl = (eName: string) => {
  return ImageSrc(`${config.character.baseUrl}/${eName}/side_avatar.png`);
};

const selectMenu = ref('')

watchEffect(() => {
  store.setRight(selectMenu.value)
})
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
          <CharacterBox
            v-for="(i, index) in team"
            :key="`${i.character_id}/${i.id}`"
            inteam
            :avatar="handleAvatarUrl(i.eName)"
            :dataKey="i.id"
            :dataIndex="index"
          />
          <CharacterBox
            v-for="(i, index) in list"
            :key="`${i.character_id}/${i.id}`"
            :avatar="handleAvatarUrl(i.eName)"
            :dataKey="i.id"
            :dataIndex="team.length + index"
          />
        </div>
      </ScrollView>

      <div :class="S('menu-container')">
        <Button
          v-if="canExpand"
          type="spread"
          @click="() => emits('toExpand')"
          icon="menu"
        />
        <div
          v-else
          style="height: 64px"
        ></div>
      </div>
    </div>
    <div :class="S('options')">
      <div :class="S('element-and-name')">{{ current.element }}元素 / {{ current.name }}</div>
      <Menu v-model="selectMenu" :options="menu" />
    </div>
  </div>
</template>

<style scoped lang="less">
.box {
  width: 500px;
  height: 100vh;
  max-height: 100vh;
  position: absolute;

  overflow: hidden;
  top: 0;
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
      width: 130px;
      transition: 0.3s ease;
      z-index: 0;

      height: 64px;
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
      background: no-repeat center top -35px / 75%;

      width: 130px;
      height: 64px;
      margin: 0 auto;

      position: relative;

      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
        aspect-ratio: 1;
        width: 60px;

        border: 3px solid transparent;
        box-sizing: content-box;
        border-radius: 50%;

        line-height: 64px;
        text-align: center;

        overflow: hidden;
        background: @shadow;
      }
    }

    &-inteam:after {
      background: @selected-bgc;
      border: 3px solid @selected-border;
      box-sizing: content-box;
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
</style>
