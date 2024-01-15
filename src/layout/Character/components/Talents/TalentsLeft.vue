<script setup lang="ts">
import { ImageSrc } from '@/components';

import { Weapon, Button, Line, Tabs, TabPane, HighLight } from '@shi-zhong/genshin-ui';

import { ClassNameFactor } from '@/utils/className';
import { computed, ref } from 'vue';
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';
import { useConfig } from '@/stores/config';

const S = ClassNameFactor('skills-');

const { Bow, Catalyst, Claymore, Polearm, Sword } = Weapon.WeaponPicture;

const store = useCharacterLayoutStore();
const config = useConfig();

const talent = computed(
  () =>
    store.characterStatic?.talents[store.talent] || {
      name: '天赋名',
      intro: '技能描述',
      detail: []
    }
);

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
  } else if (index === -1) {
    return '';
  }
  return ImageSrc(
    `/static/${config.character.baseUrl}/${store.characterStatic?.basic.eName}/talent${index + 1}.png`
  );
};

const realLevel = computed(() => {
  const extra = store.livesExtraTalent[store.talent] ?? 0;
  return extra + (store.character?.talents[store.talent] ?? 1);
});

const active = ref('intro');
</script>

<template>
  <div :class="S()">
    <div :class="S('basic')">
      <div :class="S('talent-type')">
        {{ store.talent <= 2 ? '战斗天赋' : '固有天赋' }}
      </div>
      <img
        :class="S('talent-icon')"
        :src="handleRealImage(store.talent)"
        :draggable="false"
        alt=""
      />
      <div :class="S('talent-name')">
        {{ talent.name }}
      </div>
      <div :class="S('talent-lvl')">Lv.{{ realLevel }}</div>
    </div>
    <Tabs
      :class="S('tabs-con')"
      :disable="[0, 1, 2].includes(store.talent) ? [] : ['attri']"
      :active="[0, 1, 2].includes(store.talent) ? active : 'intro'"
      @change="(a) => (active = a)"
    >
      <TabPane
        tabKey="intro"
        title="天赋介绍"
      >
        <HighLight
          :class="S('tabs-intro')"
          :text="talent.intro"
        />
      </TabPane>
      <TabPane
        tabKey="attri"
        :title="[0, 1, 2].includes(store.talent) ? '详细属性' : ''"
      >
        <div
          v-for="i in talent.detail"
          :key="i.name"
          :class="S('tabs-cell')"
        >
          <span>{{ i.name }}</span>
          <span
            :class="{
              smaller: (i.data[store.character?.talents[store.talent] || -1] || '').length > 16
            }"
            >{{ i.data[store.character?.talents[store.talent] || -1] || '' }}</span
          >
        </div>
      </TabPane>
    </Tabs>
    <Line :style="{ margin: '0 25px' }" />
    <div
      v-if="store.talent <= 2"
      :class="S('button-con')"
    >
    <!-- sound="dong" -->
      <Button
        type="shrink"
        icon="fork"
        :disable="store.character?.talents[store.talent] === 1"
        balance
        @click="() => store.setTalentLevel(false)"
        >降级
      </Button>
      <div :class="S('gap')"></div>
      <!-- sound="dong" -->
      <Button
        type="shrink"
        icon="round"
        :disable="store.character?.talents[store.talent] === 10"
        balance
        @click="() => store.setTalentLevel(true)"
        >升级
      </Button>
    </div>
    <div
      v-else
      :class="S('button-max')"
    >
      已达到最大等级
    </div>
  </div>
</template>

<style scoped lang="less">
.skills {
  &- {
    width: 500px;
    height: 100vh;
    max-height: 100vh;
    position: absolute;

    overflow: hidden;
    top: 0;
    background: linear-gradient(180deg, @fontdarkgray, rgba(72, 85, 103, 0.7) ;);
    height: 100vh;
    width: 500px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }

  &-basic {
    text-align: center;
    padding: 20px;
    background: transparent;
    user-select: none;

    flex-shrink: 0;
  }

  &-tabs {
    &-con {
      width: 90%;
      margin: 0 auto;
      flex-shrink: 1;
      flex-grow: 1;
      overflow: hidden;
    }
    &-intro {
      margin-top: 20px;
    }

    &-cell {
      display: flex;
      justify-content: space-between;
      background-color: rgba(44, 52, 64, 0.697);
      margin: 7px 0;
      padding: 0 15px;
      height: 50px;
      line-height: 50px;
      border-radius: 3px;
      overflow: hidden;

      & :first-child {
        color: @fontgold;
      }
    }
  }

  &-talent {
    &-type {
      color: var(--highlight-spe);
    }
    &-icon {
      width: 80px;
    }

    &-name {
      color: var(--highlight-spe);
      font-size: 18px;
    }
    &-lvl {
      color: @blank-white;
    }
  }

  &-button-con {
    padding: 20px;
    display: flex;
    flex-shrink: 0;
  }

  &-gap {
    width: 20px;
  }

  &-button-max {
    background: rgb(146, 45, 45);
    margin: 20px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: orange;
    opacity: 0.6;
  }
}

// 长度过长时缩小字体
.smaller {
  font-size: 18px;
}
</style>
