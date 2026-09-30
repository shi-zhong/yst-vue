<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
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
import ENameMap from './eNameMap.json';

const props = defineProps<{ select?: CharacterModel }>();
const emits = defineEmits<{ (e: 'change', id: number): void }>();

const router = useRouter();
const layout = useCharacterLayoutStore();
const id = ref(-1);

const uuid = ref(0);

const basic = reactive<CharacterBasicModel>({} as any);

const breakThroughLevels = ref<[number, number, number][]>([]);

const talents = ref<CharacterTalentsModel[]>([]);

const lives = ref<CharacterConstellationModel[]>([]);

const material = reactive({
  boss: '',
  specialty: '',
  drops: ''
});

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
  break_through_levels: breakThroughLevels.value,
  material: material,
  talents: talents.value,
  lives: lives.value
});

const elementDrawer = (txt: string) => {
  const reg =
    /([火水雷冰草风岩](?:(?:元素抗性)|(?:元素范围伤害)|(?:元素伤害加成)|(?:元素伤害)|(?:元素附魔)|(?:元素附着)))/g;

  const codes = ['火', '水', '雷', '冰', '草', '风', '岩'];

  return txt
    .replace(reg, (patch) => {
      return `$${codes.indexOf(patch[0]) + 1}${patch}$`;
    })
    .replace(/潮湿/g, '$2潮湿$');
};

/**--------------------------------- */
const handleDrop = (text: string, file: File) => {
  if (file.type !== 'application/json') return;

  const data = JSON.parse(text);

  if (VerifyType<CharacterModel>(Miyoushe as any, data)) {
    // emits('change', -1);
    id.value = 0;
    uuid.value = data.uuid;
    lives.value = data.lives;

    merge(basic, data.basic);
    merge(material, data.material);

    basic.eName = (ENameMap as any)[basic.name];

    const eqSkills = [data.talents[1].name, data.talents[2].name];
    const textDrawer = (txt: string) => {
      return elementDrawer(txt)
        .replace(`${eqSkills[0]}`, `$0${eqSkills[0]}$`)
        .replace(`${eqSkills[1]}`, `$0${eqSkills[1]}$`)
        .replace(/\n\n.{1,10}\n/g, (t) => `$0${t}$`);
    };

    // 命座更新
    lives.value = data.lives.map((l) => ({
      name: l.name,
      desc: textDrawer(l.desc)
    }));

    // 天赋更新
    talents.value = data.talents.map((t, i) => ({
      detail: t.detail,
      type: t.type,
      name: t.name,
      intro: i ? textDrawer(t.intro) : textDrawer(t.intro).replace('普通攻击', '$0普通攻击$')
    }));

    Message.success('米游社文件格式.');
  } else {
    Message.success('文件格式不符!');
  }
};

const handlePreview = () => {
  if (basic.intro === '') {
    Message.info('必须填写介绍');
    return;
  }
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

onMounted(() => {

});
</script>

<template>
  <Editor
    :isNew="select !== undefined"
    :title="id !== -1 ? `${id}-${uuid}` : ''"
    :using="select !== undefined || id === 0"
    preview
    :icon="CharacterPng"
    @drop="handleDrop"
    @close="
      () => {
        emits('change', -1);
        id = -1;
      }
    "
    @preview="handlePreview"
  >
    <div>
      简化开发工程和资源，主要配置只接受直接解析json文件 允许配置以下项目
      <div>
        <textarea
          class="e-intro"
          v-model="basic.intro"
        ></textarea>
      </div>
    </div>
  </Editor>
</template>

<style scoped lang="less">
.e-name {
  height: 50px;
  font-size: 24px;
  margin: 10px 0;
}
.e-intro {
  display: block;
  width: 500px;
  height: 300px;
  resize: none;
  font-size: 20px;
}
</style>
