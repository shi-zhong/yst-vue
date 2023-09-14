<script setup lang="ts">
import { LazyImage } from '@/utils/directive/lazyImage';
import { Rarity, RarityToColor, ScrollView } from '@/components';
import { WeaponCard, WeaponDetailCard } from '@/components/Weapon';
import { onUnmounted, ref } from 'vue';
import Editor from './editor.vue';
import { EventDispatch } from '@/utils';
import I from '@/assets/wolfs_gravestone.webp';

const view = ref();

const { close, vLazy } = LazyImage(view.value);

const activeData = ref(0);

onUnmounted(() => {
  close();
});

const handleActive = (e: Event) => {
  EventDispatch(e, {
    'weapon-card': (dataset) => {
      activeData.value = +dataset.key;
    }
  });
};
</script>

<template>
  <div class="title">武器</div>
  <div class="content">
    <ScrollView
      class="weapon-list"
      ref="view"
      scroll-behavior="scroll"
      data-type="top"
      @click="handleActive"
    >
      <WeaponCard
        :imgurl="I"
        :lvl="90"
        :locked="true"
        :rarity="5"
      />
      <WeaponDetailCard
        :id="0"
        :type_id="0"
        :rank="6"
        :lvl="90"
        :refine="5"
        :lock="true"
        :weapon_type="{
          id: 0,
          basic: { name: '狼的末日', star: 5, type: 3, imgurl: I },
          describe:
            '黑曜石塑造的一对的权杖中的一件。在传说中，隐藏在沙海尽头的乐园门扉是由这柄密钥开启的。',
          data: { main: [], sub: { key: 'string', start: 0, growth: 0 } },
          story: [],
          effects: {
            name: '沉入沙海的史诗',
            describe:
              ' ·生命值提升$1。元素战技命中敌人时将产生持续20秒的「宏大诗篇」效果：基于装备者生命值上限的$2，获得元素精通提升，该效果每0.3秒至多触发一次，至多叠加3层。该效果叠加至3层或3层的持续时间刷新时，将基于装备者生命值上限的$3，为队伍中附近所有角色提供元素精通提升，持续20秒。',
            $: [
              ['20%', '25%', '30%', '35%', '40%'],
              ['0.12%', '0.15%', '0.18%', '0.21%', '0.24%'],
              ['0.2%', '0.25%', '0.3%', '0.35%', '0.4%']
            ]
          }
        }"
      />
    </ScrollView>
    <Editor class="weapon-right" />
  </div>
</template>

<style scoped lang="less">
.title {
  height: 80px;
  line-height: 80px;
  padding: 10px 40px;
  font-size: 30px;
  color: @fontdarkgray;
  box-shadow: 0 0 5px @fontlightgray;
}

.content {
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 100px);
}

.weapon-right {
  flex-grow: 1;
  flex-shrink: 1;
}

.weapon {
  &-list {
    margin: 0 30px;
    min-width: 530px;
    height: 100%;
  }
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    color: @blank-white;
    font-size: 25px;
    padding: 5px 10px;
  }
  &-line {
    background-color: @blank-white;
    box-shadow: 0px 0 4px @fontlightgray;
    border-radius: 5px;
    display: inline-block;
    width: 500px;
    overflow: hidden;
    margin: 10px 0;
    & img {
      width: 100px;
      height: 100px;
    }
    &:hover {
      border-color: transparent;
      box-shadow: 0px 0 8px @fontlightgray;
    }
  }
}

.bar {
  &-golden {
    background: @rank-golden-bar;
  }
  &-purple {
    background: @rank-purple-bar;
  }
  &-blue {
    background: @rank-blue-bar;
  }
  &-green {
    background: @rank-green-bar;
  }
  &-gray {
    background: @rank-gray-bar;
  }
}
</style>
