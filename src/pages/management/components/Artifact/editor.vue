<script setup lang="ts">
import { reactive, ref, toRaw, watchEffect } from 'vue';

import Editor from '../Editor.vue';

import { ScrollView, type ArtifactSlotsChinese, Message } from '@shi-zhong/genshin-ui';

import {
  type ArtifactSlotModel,
  ArtifactDetailCard,
  ArtifactSlotsToUniformNumber,
  ArtifactImgFileName
} from '@/components/Artifact';
import { useArtifactStore } from '@/stores/Artifact';
import { UploadImg } from '@/api/common';
import ArtifactPng from '@/assets/icons/artifact.png';

import { merge } from '@/utils';
import { ArtifactSuitAdd, ArtifactSuitModify } from '@/api/ArtifactSuit';
import { useConfig } from '@/stores/config';

const props = defineProps<{ active: number }>();
const emits = defineEmits<{ (e: 'change', id: number): void }>();
const store = useArtifactStore();
const config = useConfig();

const basic = reactive({
  name: '',
  id: -1,
  uuid: 0,
  rarity: 1 as 1 | 2 | 3 | 4 | 5,
  effects: [] as { limit: number; describe: string }[]
});

const slots = ref<ArtifactSlotModel[]>([]);
const slotImageFile = ref<(File | undefined)[]>([]);
const slotImageFileBase64 = ref<(string | undefined)[]>([]);

/** 生成预览卡片参数 */
const mains = [
  {
    key: '生命值',
    value: '4780'
  },
  {
    key: '攻击力',
    value: '311'
  },
  {
    key: '攻击力',
    value: '46.6'
  },
  {
    key: '冰元素伤害加成',
    value: '46.6%'
  },
  {
    key: '暴击率',
    value: '31.1%'
  }
];

const subs = [
  {
    key: '攻击力',
    value: '9.3%'
  },
  {
    key: '暴击率',
    value: '5.8%'
  },
  {
    key: '暴击率',
    value: '19.4%'
  },
  {
    key: '生命值',
    value: '299'
  }
];

const previewArtifactCard = (): any[] => {
  const { id, name, rarity, effects } = toRaw(basic);
  const preview = {
    id,
    name,
    rarity,
    slots: slots.value,
    effects
  };

  return slots.value.map((slot, i) => ({
    id: 0,
    suitId: preview.id,
    suit: preview,
    type: slot.type,
    lock: true,
    suitCount: 5,
    lvl: 4 * preview.rarity,
    main: mains[i],
    subs,
    visible: slot.name
  }));
};

const handleSave = async () => {
  const { id, uuid, name, rarity, effects } = toRaw(basic);

  const data = {
    id: id,
    uuid: uuid,
    name,
    rarity: rarity,
    slots: slots.value,
    effects: effects
  };

  let res: any;

  if (id === -1) {
    data.id = 0;
    res = await ArtifactSuitAdd(data);
    if (res.msg === 'OK') {
      basic.id = res.data.id;
    }
  } else {
    res = await ArtifactSuitModify(basic.id, data);
  }

  if (res.msg === 'OK' && slotImageFile.value.length) {
    await Promise.all(
      slotImageFile.value.map((f, i) => {
        if (f === undefined) return Promise.resolve('');
        else {
          const formData = new FormData();
          formData.append('imgfile', f, ArtifactImgFileName(basic.id, i));

          return UploadImg(formData, { dir: config.artifact.baseUrl }).then((data) => {
            if (data.msg === 'OK') {
              return data.data.url;
            }
            return '';
          });
        }
      })
    );
    Message.info('图片上传完成！');
  }

  if (res.msg === 'OK') store.GenerateArtifactSuits();
  else console.error('error');
};

const previewCardGroup = ref(previewArtifactCard());

const handleDropJsonFile = (text: string, file: File) => {
  if (file.type !== 'application/json') return;

  const data = JSON.parse(text);

  // search same to change
  const old = store.ArtifactSuitByUUId(Number(data.id));

  if (old.id !== 0) {
    basic.id = old.id;
  } else {
    basic.id = -1;
  }

  emits('change', -1);

  slotImageFile.value = [];
  slotImageFileBase64.value = [];

  basic.name = data.name;
  basic.uuid = Number(data.id);
  basic.rarity = data.rarity;
  basic.effects = data.effects;

  const islots: any = [
    { type: '', name: '', describe: '', story: '' },
    { type: '', name: '', describe: '', story: '' },
    { type: '', name: '', describe: '', story: '' },
    { type: '', name: '', describe: '', story: '' },
    { type: '', name: '', describe: '', story: '' }
  ];

  data.slot.map((i: { type: ArtifactSlotsChinese; name: string; desc: string; story: string }) => {
    if (i.type)
      islots[ArtifactSlotsToUniformNumber(i.type)] = {
        type: i.type,
        name: i.name,
        describe: i.desc,
        story: i.story
      };
  });

  slots.value = islots;

  previewCardGroup.value = previewArtifactCard();
};

// 单文件也会触发
const handleDropFiles = (files: { file: string; origin: File }[]) => {
  const mapper: { [key: string]: number } = {
    _1: 3,
    _2: 1,
    _3: 4,
    _4: 0,
    _5: 2
  };

  files.map((file) => {
    if (file.origin.type.startsWith('image')) {
      const reg = /.*(_\d)\.png$/.exec(file.origin.name);
      if (reg) {
        slotImageFile.value[mapper[reg[1]]] = file.origin;
        slotImageFileBase64.value[mapper[reg[1]]] = file.file;
      }
    } else {
      handleDropJsonFile(file.file, file.origin);
    }
  });
};

const handleClose = () => {
  emits('change', 0);
  basic.uuid = 0;
  basic.id = -1;
};

watchEffect(() => {
  if (store.artifactSuits.has(props.active)) {
    // 同步store
    const artifact = store.ArtifactSuitById(props.active)!;

    merge(basic, {
      id: artifact.id,
      uuid: artifact.uuid,
      name: artifact.name,
      rarity: artifact.rarity,
      effects: artifact.effects
    });

    slots.value = artifact.slots;
    slotImageFile.value = [];
    slotImageFileBase64.value = [];
  }
  previewCardGroup.value = previewArtifactCard();
});
</script>

<template>
  <Editor
    class="artifact-edit"
    :isNew="basic.id === -1"
    :title="basic.uuid ? `${basic.id}-${basic.uuid}` : ''"
    :using="props.active !== 0"
    :icon="ArtifactPng"
    @drop="handleDropFiles"
    @close="handleClose"
    @save="handleSave"
  >
    <ScrollView
      direction="x"
      scroll-behavior="scroll"
      transform-box-class="tsbox"
      style="height: 100%"
    >
      <ScrollView
        v-for="(artifact, i) of previewCardGroup"
        :key="artifact.type"
        :border="{ top: 100, bottom: 100 }"
        scroll-behavior="hidden"
      >
        <ArtifactDetailCard
          v-if="artifact.visible"
          :size="40"
          v-bind="artifact"
          :img-url="slotImageFileBase64[i]"
        />
      </ScrollView>
    </ScrollView>
  </Editor>
</template>

<style scoped lang="less">
@shadow2: 0 0 5px var(--font-light-gray);
.inputtext {
  width: 300px;
  height: 40px;
  margin: 0 50px 0 0;
  line-height: 40px;
  border-radius: 20px;

  box-shadow: @shadow2;
  border: none;

  text-align: center;
  font-size: 20px;
  color: var(--font-dark-gray);
  font-weight: bold;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
}
:deep(.tsbox) {
  display: inline-flex;
  justify-content: start;
  white-space: pre-wrap;
}
.artifact {
  &-edit {
    & :where(input, textarea)::placeholder,
    &::-webkit-input-placeholder {
      // color: red;
      color: rgba(0, 0, 0, 0.2);
    }

    margin: 30px;
    min-width: 1008px;
    padding: 30px;
    border-radius: 5px;
    box-shadow: 0 0 10px var(--font-light-gray);
    display: flex;
    flex-flow: column;
  }

  &-tool {
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    & button {
      background-color: transparent;
      border: 0;
      font-size: 20px;
      &:hover {
        color: var(--font-light-gray);
      }
      &:active {
        opacity: 0.8;
      }
    }
  }

  &-blank {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
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
        color: var(--font-dark-gray);
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
        color: var(--font-light-gray);
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

.effects.value {
  width: 300px;
  height: 200px;
  font-size: 20px;
  color: var(--font-dark-gray);
  resize: none;
  border: none;
  box-shadow: @shadow2;

  &-box {
    display: flex;
    justify-content: space-between;
  }
}
</style>
