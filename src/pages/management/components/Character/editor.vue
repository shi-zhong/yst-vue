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
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';

import Miyoushe from './Miyoushe.json';
import Editor from '../Editor.vue';
import { useRouter } from 'vue-router';
import { DeepClone } from '@/utils/tools';

const props = defineProps<{ select?: CharacterModel }>();
const emits = defineEmits<{ (e: 'change', id: number): void }>();

const router = useRouter();
const layout = useCharacterLayoutStore();
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
  breakThroughLevels: breakThroughLevels.value,
  material: {},
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

const handlePreview = () => {
  layout.pushCharacterStatic({ ...buildSave(), id: 0 });
  layout.setList([
    {
      character_id: 0,
      id: 0,
      lives: 6,
      lvl: 90,
      talents: [9, 9, 9]
    }
  ]);
  router.push('/manage/character/preview');
};

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
    preview
    :icon="CharacterPng"
    @drop="handleDrop"
    @preview="handlePreview"
  >
    <div>
      简化开发工程和资源，主要配置只接受直接解析json文件 允许配置以下项目
      <input
        type="text"
        v-model="basic.eName"
      />
      <textarea v-model="basic.intro"></textarea>
    </div>
  </Editor>
</template>

<style scoped lang="less"></style>
