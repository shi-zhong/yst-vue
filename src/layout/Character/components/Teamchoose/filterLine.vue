<script setup lang="ts">
import { ClassNameFactor } from '@/utils';
import { ScrollView } from '@shi-zhong/genshin-ui';

import { elements, weapons } from './static';
import Trash from '@/assets/icons/trash.png';

const S = ClassNameFactor('filter-line-');

defineProps<{
  weaponSelect: string[];
  elementSelect: string[];
}>();

const emits = defineEmits<{
  (e: 'reset'): void;
}>();
</script>

<template>
  <div :class="S('render-container')">
    <ScrollView
      :class="S('selected')"
      direction="x"
      :border="{ left: 100, right: 200 }"
    >
      <div :class="S('flex')">
        <template
          v-for="element in elements"
          :key="element.txt"
        >
          <div
            :class="S('selected-item')"
            v-show="elementSelect.includes(element.txt)"
          >
            {{ element.txt }}
          </div>
        </template>
        <template
          v-for="weapon in weapons"
          :key="weapon.txt"
        >
          <div
            :class="S('selected-item')"
            v-show="weaponSelect.includes(weapon.txt)"
          >
            {{ weapon.txt }}
          </div>
        </template>
        <div class="placeholder"></div>
      </div>
      <template #extra>
        <button
          :class="S('clear')"
          @click="() => emits('reset')"
        >
          <img
            :class="S('trash')"
            :src="Trash"
            alt=""
          />清除
        </button>
      </template>
    </ScrollView>
  </div>
</template>

<style scoped lang="less">
.filter-line {
  &-render-container {
    width: 500px;
    padding: 0 20px;
    box-sizing: border-box;
    position: absolute;
    z-index: 2;
    bottom: 90px;
  }
  &-selected {
    background-color: #ede5d8c0;
    width: calc(100% - 25px);
    box-sizing: border-box;
    margin: 0 15px 0 10px;
    height: 40px;
    border-radius: 20px;
    overflow: hidden;

    &-item {
      height: 30px;
      margin: 0 5px;
      padding: 5px 10px;
      box-sizing: border-box;

      flex-shrink: 0;

      line-height: 25px;
      color: @fontdarkgray;

      border-radius: 20px;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
      background-color: white;
    }
  }

  &-flex {
    display: inline-flex;
    flex-flow: row nowrap;
    align-items: center;
    min-width: 100%;
    height: 40px;
  }

  &-clear {
    position: absolute;
    top: 0;
    right: 0;

    height: 30px;
    margin: 5px;
    padding: 5px 10px;
    box-sizing: border-box;

    line-height: 25px;
    color: @blank-white;

    border: 0;
    border-radius: 20px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    background-color: @fontdarkgray;
    padding-right: 20px;

    outline: none;
  }

  &-trash {
    width: 15px;
    margin: 0 15px 0 0;
    vertical-align: middle;
  }
}

.placeholder {
  width: 90px;
}
</style>
