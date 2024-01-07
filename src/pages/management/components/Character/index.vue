<script setup lang="ts">
import CharacterCard from '@/components/Cards/CharacterCard.vue';

import { ScrollView } from '@shi-zhong/genshin-ui/base';

import { computed, ref } from 'vue';
import Editor from './editor.vue';
import { EventDispatch } from '@/utils';
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';

const activeData = ref(-1);

const handleActive = (e: Event) => {
  EventDispatch(e, {
    ch: (dataset) => {
      activeData.value = +dataset.key;
    }
  });
};

const store = useCharacterLayoutStore();

const cards = computed(() =>
  store.clist.map((c) => ({
    element: c.basic.element,
    name: c.basic.name,
    eName: c.basic.eName,
    star: c.basic.star,
    id: c.id
  }))
);

const select = computed(() => store.clist.find((c) => c.id === activeData.value));
</script>

<template>
  <div class="title">角色</div>
  <div class="content">
    <ScrollView
      class="character-list"
      scroll-behavior="scroll"
      data-type="top"
      @click="handleActive"
    >
      <CharacterCard
        v-for="card of cards"
        data-type="ch"
        :data-key="card.id"
        :key="card.eName"
        v-bind="card"
      />
    </ScrollView>
    <Editor
      class="character-right"
      :select="select"
      @change="(id: number) => activeData = id"
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

.character-right {
  flex-grow: 1;
  flex-shrink: 1;
}

.character {
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
