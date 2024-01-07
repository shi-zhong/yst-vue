<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type {
  CharacterBasicModel,
  CharacterTalentsModel,
  CharacterConstellationModel,
  CharacterModel
} from '@/interface/characters';

import CharacterPng from '@/assets/icons/character.png';
import { merge, VerifyType } from '@/utils';
import { Message } from '@shi-zhong/genshin-ui';

import Miyoushe from './Miyoushe.json';
import { useConfig } from '@/stores/config';
import Editor from '../Editor.vue';

import { DeepClone } from '@/utils/tools';

const props = defineProps<{ select?: CharacterModel }>();
const emits = defineEmits<{ (e: 'change', id: number): void }>();

const config = useConfig();

const id = ref(0);

const uuid = ref(0);

const basic = reactive<CharacterBasicModel>({} as any);

const breakThroughLevels = ref<number[][]>([]);

const talents = ref<CharacterTalentsModel[]>([]);

const lives = ref<CharacterConstellationModel[]>([]);

const mergeModel = (ch: CharacterModel) => {
  id.value = ch.id;
  uuid.value = ch.uuid;
  merge(basic, ch.basic);
  breakThroughLevels.value = ch.break_through_levels;
  talents.value = ch.talents;
  lives.value = ch.lives;
};

const buildSave = () => ({
  id: id.value,
  uuid: uuid.value,
  basic: basic,

  talents: talents.value,
  lives: lives.value
});

const textSource = reactive({
  source: '',
  index: 0
});

/**--------------------------------- */
const handleDrop = (text: string, file: File) => {
  if (file.type !== 'application/json') return;

  const data = JSON.parse(text);

  if (VerifyType<CharacterModel>(Miyoushe as any, data)) {
    //   emits('change', -1);
    uuid.value = data.uuid;
    lives.value = data.lives;

    merge(basic, data.basic);

    // 命座更新
    lives.value = [...data.lives];

    // 天赋更新
    talents.value = [...data.talents];

    Message.success('米游社文件格式.');
  } else {
    Message.success('文件格式不符!');
  }
};

const basicDraw = (txt: string) => {};

watch(
  () => props.select,
  () => {
    if (props.select !== undefined) {
      mergeModel(DeepClone(props.select));
    }
  },
  { immediate: true }
);
</script>

<template>
  <Editor
    :isNew="select !== undefined"
    :title="id ? `${id}-${uuid}` : ''"
    :using="select !== undefined || uuid !== 0"
    :icon="CharacterPng"
    @drop="handleDrop"
  >
    <div>
      <input
        type="text"
        v-model="basic.eName"
      />
      <textarea v-model="basic.intro"></textarea>
    </div>
  </Editor>
</template>

<style scoped lang="less"></style>
