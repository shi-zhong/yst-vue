<script setup lang="ts">
import { ScrollView, Button as FButton, Line } from '@shi-zhong/genshin-ui';
import { ClassNameFactor, EventDispatch } from '@/utils';
import { elements, weapons } from './static';

const props = defineProps<{
  tempWeaponFilter: string[];
  tempElementFilter: string[];
}>();

const emits = defineEmits<{
  (e: 'update', tag: 'confirm' | 'rollback' | 'update', element: string[], weapon: string[]): void;
}>();

const S = ClassNameFactor('filter-');

const updateModelElement = (e: Event) => {
  EventDispatch<{ element: string }>(e, {
    element: (dataset) => {
      const exist = props.tempElementFilter.indexOf(dataset.element);
      if (exist === -1) {
        emits(
          'update',
          'update',
          [...props.tempElementFilter, dataset.element],
          props.tempWeaponFilter
        );
      } else {
        emits(
          'update',
          'update',
          props.tempElementFilter.filter((e) => e !== dataset.element),
          props.tempWeaponFilter
        );
      }
    }
  });
};

const updateModelWeapon = (e: Event) => {
  EventDispatch<{ weapon: string }>(e, {
    weapon: (dataset) => {
      const exist = props.tempWeaponFilter.indexOf(dataset.weapon);
      if (exist === -1) {
        emits('update', 'update', props.tempElementFilter, [
          ...props.tempWeaponFilter,
          dataset.weapon
        ]);
      } else {
        emits(
          'update',
          'update',
          props.tempElementFilter,
          props.tempWeaponFilter.filter((w) => w !== dataset.weapon)
        );
      }
    }
  });
};
</script>

<template>
  <div
    :class="S('mask')"
    @click="() => emits('update', 'rollback', [], [])"
  >
    <div
      :class="S()"
      @click.stop="() => {}"
    >
      <div :class="S('header')">筛选</div>
      <Line />
      <div :class="S('list')">
        <ScrollView
          :class="S('root')"
          scrollbar
          slide
        >
          <div :class="S('title')">元素</div>
          <div
            data-type="click"
            @click="updateModelElement"
          >
            <!-- 使用 input 和 label 会因为 label 的默认事件导致在列表滚动之后事件仍会执行，阻止默认之后会导致点击失效 -->
            <div
              v-for="element in elements"
              :key="element.txt"
              data-type="element"
              :data-element="element.txt"
              :class="
                S({
                  'muti-option': true,
                  select: tempElementFilter.includes(element.txt)
                })
              "
            >
              {{ element.txt }}
            </div>
          </div>

          <div :class="S('title')">武器</div>
          <div
            data-type="click"
            @click="updateModelWeapon"
            style="margin-bottom: 50px"
          >
            <label
              v-for="weapon in weapons"
              :key="weapon.txt"
              data-type="weapon"
              :data-weapon="weapon.txt"
              :class="
                S({
                  'muti-option': true,
                  select: tempWeaponFilter.includes(weapon.txt)
                })
              "
            >
              {{ weapon.txt }}
            </label>
          </div>
        </ScrollView>
      </div>
      <div :class="S('options')">
        <FButton
          type="shrink"
          @click="() => emits('update', 'confirm', [], [])"
          icon="round"
          >确认筛选
        </FButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.filter {
  &- {
    width: 500px;
    height: 100vh;
    max-height: 100vh;
    position: absolute;

    overflow: hidden;
    top: 0;
    // width: 430px;
    background: @fontdarkgray;

    padding: 0 20px;
    box-sizing: border-box;

    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }
  &-mask {
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 2;
  }
  &-header {
    height: 60px;
    flex-shrink: 0;
    color: rgb(211, 189, 142);

    margin-top: 20px;

    font-size: 30px;
    user-select: none;

    display: flex;
    align-items: center;
  }

  &-title {
    color: @blank-white;
    font-size: 26px;
    margin: 15px;
  }

  &-muti-option {
    position: relative;
    display: inline-block;
    width: 45%;
    height: 80px;
    line-height: 80px;
    padding-left: 50px;
    font-size: 20px;
    box-sizing: border-box;
    margin: 10px;

    border: 1px solid @fontlightgray;
    border-radius: 4px;

    cursor: inherit;

    color: @blank-white;

    &::before {
      content: '';
      // common
      display: block;
      border: 2px solid @fontlightgray;

      // not select
      height: 20px;
      width: 20px;

      border-radius: 50%;
      position: absolute;
      left: 10px;
      top: 50%;

      transform-origin: 10px 5px;
      transform: translateY(-50%);
    }
  }

  &-select {
    background-color: @blank-white;
    color: @fontdarkgray;
    &::before {
      content: '';
      display: block;
      width: 20px;
      height: 10px;

      border: 5px solid @selected-border;
      border-top: transparent;
      border-right: transparent;
      border-radius: 3px;

      transform: translateY(-50%) rotate(-45deg);
    }

    &::after {
    }
  }
  &-options {
    flex-shrink: 0;
    margin: 20px 0;
  }

  &-list {
    position: relative;

    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
  }

  &-root {
    height: 100%;
  }
}
</style>
