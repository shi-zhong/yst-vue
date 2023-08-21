<script setup lang="ts">
import { reactive, ref, toRaw, watchEffect } from 'vue';
import { Drop } from '@/utils/directive';
import { Rarity, Icon, ScrollView, DropImage, DropFile } from '@/components';
import ArrowPng from '@/assets/icons/arrow.png';
import { merge } from '@/utils';

const basic = reactive({
  id: 0,
  name: ''
});
const rarity = ref<1 | 2 | 3 | 4 | 5>(1);

const slotImageFile = reactive({
  FlowerOfLife: undefined,
  PlumnOfDeath: undefined,
  SandsOfEon: undefined,
  GobletOfEonothem: undefined,
  CircletOfLogos: undefined
});
const effects = reactive(['', '', '', '']);

watchEffect(() => {});

const handleRarity = (dire: boolean) => {
  if (dire && rarity.value < 5) {
    rarity.value++;
  } else if (!dire && rarity.value > 1) {
    rarity.value--;
  }
};

const stopPropation = (e: Event) => {
  if ((e.target! as any).nodeName === 'TEXTAREA' || (e.target! as any).nodeName === 'INPUT') {
    e.stopPropagation();
  }
};

const buildSave = () => {
  
};

const { vDrop } = Drop();

const clear = () => {};

const handleDrop = (text: string) => {};
</script>

<template>
  <div
    class="artifact-edit"
    v-drop="handleDrop"
  >
    <div class="artifact-tool">
      <span>编辑器</span>
      <button
        @click="
          () => {
            const data = buildSave();
            // uplaod
          }
        "
      >
        保存
      </button>
    </div>
    <div class="artifact-basic">
      <input
        type="number"
        class="inputtext"
        v-model="basic.id"
        placeholder="ID"
        min="0"
        max="9999"
      />
      <input
        type="text"
        class="inputtext"
        v-model="basic.name"
        placeholder="武器名称"
      />
      <div class="artifact-rarity">
        <Icon
          type="projection"
          color="rgb(72, 85, 103)"
          :src="ArrowPng"
          :size="30"
          @click="() => handleRarity(false)"
        />
        <Rarity
          :rarity="rarity"
          :size="30"
        />
        <Icon
          type="projection"
          color="rgb(72, 85, 103)"
          :src="ArrowPng"
          :size="30"
          @click="() => handleRarity(true)"
          style="transform: rotate(180deg)"
        />
      </div>
    </div>
    <ScrollView
      class="artifact-scroll"
      scroll-behavior="hidden"
    >

    </ScrollView>
  </div>
</template>

<style scoped lang="less">
@shadow2: 0 0 5px @fontlightgray;
.inputtext {
  width: 300px;
  height: 40px;
  margin: 0 50px 0 0;
  line-height: 40px;
  border-radius: 20px;

  box-shadow: 0 0 5px @fontlightgray;
  border: none;

  text-align: center;
  font-size: 20px;
  color: @fontdarkgray;
  font-weight: bold;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
}

.artifact {
  &-edit {
    & :where(input, textarea)::placeholder,
    &::-webkit-input-placeholder {
      // color: red;
      color: rgba(0, 0, 0, 0.2);
    }

    margin: 30px;
    padding: 30px;
    border-radius: 5px;
    box-shadow: 0 0 10px @fontlightgray;
    display: flex;
    flex-flow: column;
  }

  &-tool {
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    & > button {
      background-color: transparent;
      border: 0;
      font-size: 20px;
      &:hover {
        color: @fontlightgray;
      }
      &:active {
        opacity: 0.8;
      }
    }
  }

  &-basic {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &-rarity {
    width: 300px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-slot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;

    & > :nth-child(1) {
      width: 300px;
      & > :nth-child(1) {
        height: 42px;
        line-height: 42px;
        font-size: 25px;
        text-align: center;
        color: @fontdarkgray;
        margin-bottom: 20px;
      }
    }

    & > :nth-child(2) {
      height: 110px;
      font-size: 18px;
      resize: none;
      border: none;
      box-shadow: @shadow2;
      outline: none;
    }

    & > button {
      background-color: transparent;
      border: 0;
      font-size: 20px;
      &:hover {
        color: @fontlightgray;
      }
      &:active {
        opacity: 0.8;
      }
    }
  }

  &-scroll {
    flex-shrink: 1;
    padding: 3px;
  }
}
</style>
