<script setup lang="ts">
import { useArtifactStore } from '@/stores/Artifact';
import { LazyImage } from '@/utils/directive/lazyImage';
import { Image, Rarity, RarityToColor, ScrollView } from '@/components';
import { onUnmounted, ref } from 'vue';
import Editor from './editor.vue';
import { EventDispatch } from '@/utils';

const view = ref();

const { close, vLazy } = LazyImage(view.value);

const store = useArtifactStore();

const activeData = ref(-1);

onUnmounted(() => {
  close();
});

const handleActive = (e: Event) => {
  EventDispatch(e, {
    'artifact-card': (dataset) => {
      activeData.value = +dataset.key;
    }
  });
};
</script>

<template>
  <div class="title">圣遗物</div>
  <div class="content">
    <ScrollView
      class="artifact-list"
      ref="view"
      scroll-behavior="scroll"
      data-type="top"
      slide
      @click="handleActive"
    >
      <div
        v-for="art of store.artifactSuits.values()"
        :key="art.id"
        class="artifact-line"
        data-type="artifact-card"
        :data-key="art.id"
      >
        <div
          class="artifact-title"
          :class="`bar-${RarityToColor(art.rarity)}`"
        >
          <div>{{ art.name }}</div>
          <Rarity :rarity="art.rarity" />
        </div>
        <div>
          <Image
            v-for="(value, key) in art.slots"
            :key="key"
            v-show="value.imgUrl"
            v-lazy="value.imgUrl"
            :draggable="false"
          />
        </div>
      </div>
    </ScrollView>
    <Editor
      class="artifact-right"
      :active="activeData"
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

.artifact-right {
  flex-grow: 1;
  flex-shrink: 1;
}

.artifact {
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
@/stores/Artifact
