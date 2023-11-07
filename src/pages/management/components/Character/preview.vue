<script setup lang="ts">
import CharacterLayout from '@/layout/Character/index.vue';
import Stainer from './stainer.vue';
import Data from '@/layout/Character/components/data.vue';

import Modal from '@/components/commons/Modal/Modal.vue';

import { computed, ref } from 'vue';
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';
import { WeaponTypesTransform } from '@/components';
import { useConfig } from '@/stores/config';

const options = [
  { txt: '属性', url: 'attr' },
  { txt: '命之座', url: 'lives' },
  { txt: '天赋', url: 'talents' },
  { txt: '资料', url: 'data' }
];

const visible = ref(0);

const names = {
  元素: 'element',
  生日: 'birth',
  所属: 'belong',
  命之座: 'life',
  称号: 'honor',
  突破属性: 'break_through'
} as const;

const store = useCharacterLayoutStore();
const config = useConfig();

const cRight = computed(() => ({

  data: {
    fc: Data,
    binding: {
      title: store.characterStatic?.basic.name,
      subTitle: store.characterStatic?.basic.eName,
      intro: store.characterStatic?.basic.intro,
      list: [
        {
          key: '使用武器',
          value: WeaponTypesTransform(
            config.weaponTypeCode(store.characterStatic?.basic.weapon || 1)
          )
        },
        ...Object.entries(names).map(([k, v]) => ({
          key: k,
          value: store.characterStatic?.basic[v]
        }))
      ]
    }
  }
}));
</script>

<template>
  <CharacterLayout
    :menu="options"
    :right="cRight"
    :content="[
      {
        left: ['talents', 'lives'],
        right: ['talents', 'lives'],
        fc: Stainer
      }
    ]"
    @quit="() => (visible = 1)"
  />
  <Modal
    :visible="visible"
    mask
    theme="light"
    title="提示"
    cancelText="退出"
    okText="保存"
    @ok="
      () => {
        visible = 0;
        store.uploadCharacterStatic();
      }
    "
    @cancel="
      () => {
        store.rollbackCurrentStatic();
        visible = 0;
      }
    "
    ><div class="dialog"><span>直接退出将导致修改丢失，是否保存？</span></div></Modal
  >
</template>

<style scoped lang="less">
.dialog {
  width: 100%;
  height: 350px;
  color: @fontdarkgray;
  font-size: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
