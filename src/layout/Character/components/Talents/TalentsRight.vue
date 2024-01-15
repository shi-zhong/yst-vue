<script setup lang="ts">
import { Weapon } from '@shi-zhong/genshin-ui';

import { ImageSrc } from '@/components';

import { useCharacterLayoutStore } from '@/stores/CharacterLayout';
import { useConfig } from '@/stores/config';

import { ClassNameFactor, EventDispatch } from '@/utils';

const { Bow, Catalyst, Claymore, Polearm, Sword } = Weapon.WeaponPicture;
const S = ClassNameFactor('talents-');

const store = useCharacterLayoutStore();
const config = useConfig();

const clickOutsideToClose = () => {
  if (store.sidebar === 'talents') {
    store.popSidebar();
  }
  document.removeEventListener('click', clickOutsideToClose);
  store.setTalent(-1);
};

const handleClick = (e: Event) => {
  EventDispatch(e, {
    skill: (dataset) => {
      e.stopPropagation();
      if (store.talent === -1) {
        document.addEventListener('click', clickOutsideToClose);
        store.pushSidebar('talents');
      }
      store.setTalent(parseInt(dataset.index || '-1'));
    }
  });
};

const handleRealImage = (index: number) => {
  if (index === 0) {
    const mapper = {
      Bow: Bow,
      Catalyst: Catalyst,
      Claymore: Claymore,
      Polearm: Polearm,
      Sword: Sword
    } as const;
    return mapper[config.weaponTypeCode(store.characterStatic?.basic.weapon ?? 1)];
  }
  return ImageSrc(
    `/static/${config.character.baseUrl}/${store.characterStatic?.basic.eName}/talent${index + 1}.png`
  );
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
        v-for="(i, index) in store.characterStatic?.talents"
        :key="i.name"
        :class="
          S({
            cell: true,
            select: index === store.talent
          })
        "
        data-type="skill"
        :data-index="index"
      >
        <div :class="S('event-area')">
          <div :class="S('text')">
            {{ i.name }}
            <br />
            Lv.{{ store.character?.talents[index] || 1 }}
          </div>
          <img
            :draggable="false"
            :class="S('icon')"
            :src="handleRealImage(index)"
            alt=""
          />
        </div>
      </button>
    </div>
    <div
      v-show="store.talent === -1"
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
