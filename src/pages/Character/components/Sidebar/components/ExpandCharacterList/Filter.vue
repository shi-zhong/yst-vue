<script setup lang="ts">
import { ScrollView, Button as FButton, Line } from '@/components';
import { ClassNameFactor, EventDispatch } from '@/utils';
import { ref } from 'vue';
import { useCharacterStateStore, useCharacterDataStore } from '@/stores/Character';

import Trash from '@/assets/icons/trash.png';

const elements = [
  { txt: '火元素' },
  { txt: '水元素' },
  { txt: '草元素' },
  { txt: '雷元素' },
  { txt: '风元素' },
  { txt: '冰元素' },
  { txt: '岩元素' }
];

const weapons = [
  { txt: '单手剑' },
  { txt: '双手剑' },
  { txt: '弓' },
  { txt: '长柄武器' },
  { txt: '法器' }
];

const S = ClassNameFactor('filter-');

const elementSelect = ref<string[]>([]);
const weaponSelect = ref<string[]>([]);

const store = useCharacterStateStore();
const dataStore = useCharacterDataStore();

const updateModelElement = (e: Event) => {
  EventDispatch<{ element: string }>(e, {
    element: (dataset) => {
      const index = elementSelect.value.indexOf(dataset.element);
      if (index === -1) {
        elementSelect.value.push(dataset.element);
      } else {
        elementSelect.value.splice(index, 1);
      }
    }
  });
};
const updateModelWeapon = (e: Event) => {
  EventDispatch<{ weapon: string }>(e, {
    weapon: (dataset) => {
      const index = weaponSelect.value.indexOf(dataset.weapon);
      if (index === -1) {
        weaponSelect.value.push(dataset.weapon);
      } else {
        weaponSelect.value.splice(index, 1);
      }
    }
  });
};

const close = () => {
  elementSelect.value = [...dataStore.filter.element];
  weaponSelect.value = [...dataStore.filter.weapon];

  store.sidebar.next('back');
};

const render = document.getElementsByClassName('character-page-')[0];
</script>

<template>
  <div
    :class="S('mask')"
    @click="close"
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
            :class="S('option-list')"
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
                  select: elementSelect.includes(element.txt)
                })
              "
            >
              {{ element.txt }}
            </div>
          </div>
          <div :class="S('title')">武器</div>
          <div
            :class="S('option-list')"
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
                  select: weaponSelect.includes(weapon.txt)
                })
              "
            >
              {{ weapon.txt }}
            </label>
          </div>
        </ScrollView>
        <Teleport :to="render">
          <Transition>
            <div
              v-if="weaponSelect.length + elementSelect.length !== 0"
              class="select-render-container"
            >
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
                    @click="
                      () => {
                        elementSelect.splice(0);
                        weaponSelect.splice(0);
                      }
                    "
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
          </Transition>
        </Teleport>
      </div>
      <div :class="S('options')">
        <FButton
          type="shrink"
          @click="
            () => {
              dataStore.setFilter({
                element: [...elementSelect],
                weapon: [...weaponSelect]
              });
              store.sidebar.next('back');
            }
          "
          icon="round"
          >确认筛选
        </FButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import url(../../../../index.less);
.filter {
  &- {
    .sidebar();
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

  &-list {
    position: relative;

    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
  }

  &-root {
    height: 100%;
  }

  &-options {
    flex-shrink: 0;
    margin: 20px 0;
  }
}

.select-render-container {
  width: 500px;
  padding: 0 20px;
  box-sizing: border-box;
  position: absolute;
  z-index: 2;
  bottom: 90px;
}
.placeholder {
  width: 90px;
}
</style>
