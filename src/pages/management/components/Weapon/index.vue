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
        :imgurl="I"
        title="狼的末路"
        :rarity="5"
        type="bow"
        :main="{
          key: '',
          value: ''
        }"
        :sub="{
          key: '',
          value: ''
        }"
      />
    </ScrollView>
    <Editor
      class="weapon-right"
      v-bind="{}"
    />
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
