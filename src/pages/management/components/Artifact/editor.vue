<script setup lang="ts">
import { reactive, ref, toRaw, watchEffect } from 'vue';
import { Drop } from '@/utils/directive';
import { Icon, ScrollView, DropFile } from '@/components';
import {
  type ArtifactSuitModel,
  ArtifactSlotsNameTransform,
  type ArtifactSlotsChinese,
  type ArtifactSlots,
  ArtifactDetailCard
} from '@/components/Artifact';
import { useArtifactStore } from '@/stores/Artifact';
import { Upload } from '@/api/Request';
import ArtifactPng from '@/assets/icons/artifact.png';

import { merge, TypeNameToBackendCode, fileExt } from '@/utils';
import { ArtifactSuitAdd, ArtifactSuitModify } from '@/api/ArtifactSuit';
import { template } from './template';

const { vDrop } = Drop();

const props = defineProps<{ active: number }>();
const emits = defineEmits<{ (e: 'change', id: number): void }>();
const store = useArtifactStore();

const basic = reactive({
  name: '',
  id: 0,
  uuid: 0,
  rarity: 1 as 1 | 2 | 3 | 4 | 5
});

const slots = reactive<{
  [key in ArtifactSlots]: { imgUrl: string; name: string; describe: string };
}>({
  FlowerOfLife: {
    imgUrl: '',
    name: '',
    describe: ''
  },
  PlumnOfDeath: {
    imgUrl: '',
    name: '',
    describe: ''
  },
  SandsOfEon: {
    imgUrl: '',
    name: '',
    describe: ''
  },
  GobletOfEonothem: {
    imgUrl: '',
    name: '',
    describe: ''
  },
  CircletOfLogos: {
    imgUrl: '',
    name: '',
    describe: ''
  }
});
const slotImageFile = reactive<{ [key in ArtifactSlots]: File | undefined }>({
  FlowerOfLife: undefined,
  PlumnOfDeath: undefined,
  SandsOfEon: undefined,
  GobletOfEonothem: undefined,
  CircletOfLogos: undefined
});
const effects = reactive(['', '', '', '']);

/** 生成预览卡片参数 */
const previewArtifactCard = (): any[] => {
  const { uuid, name, rarity } = toRaw(basic);
  const preview = {
    id: uuid,
    name,
    rarity: rarity,
    slots: toRaw(slots),
    effects: effects
      .map((t, i) => ({
        limit: i + 1,
        describe: t
      }))
      .filter((i) => i.describe !== '')
  };

  const mains = {
    FlowerOfLife: {
      key: '生命值',
      value: '4780'
    },
    PlumnOfDeath: {
      key: '攻击力',
      value: '311'
    },
    SandsOfEon: {
      key: '攻击力',
      value: '46.6'
    },
    GobletOfEonothem: {
      key: '冰元素伤害加成',
      value: '46.6%'
    },
    CircletOfLogos: {
      key: '暴击率',
      value: '31.1%'
    }
  };

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

  return Object.keys(slots)
    .map((slot) => ({
      id: 0,
      suit: preview,
      type: slot,
      lock: true,
      suitCount: 5,
      lvl: 4 * preview.rarity,
      main: mains[slot as ArtifactSlots],
      subs
    }))
    .filter((s) => {
      const { describe, imgUrl, name } = preview.slots[s.type as ArtifactSlots];
      if (describe === '' || imgUrl === '' || name === '') {
        return false;
      }
      return true;
    });
};

const syncArtifact = (artifact: ArtifactSuitModel) => {
  merge(basic, {
    id: artifact.id,
    uuid: artifact.uuid,
    name: artifact.name,
    rarity: artifact.rarity
  });
  merge(slots, artifact.slots);
  merge(slotImageFile, {
    FlowerOfLife: undefined,
    PlumnOfDeath: undefined,
    SandsOfEon: undefined,
    GobletOfEonothem: undefined,
    CircletOfLogos: undefined
  });
  artifact.effects.forEach((i) => (effects[i.limit - 1] = i.describe));
};

const buildSave = async (): Promise<ArtifactSuitModel> => {
  const { id, uuid, name, rarity } = toRaw(basic);

  const filePath = await Promise.all(
    Object.entries(slotImageFile).map(([k, f]) => {
      if (f === undefined) return Promise.resolve('');
      else {
        const formData = new FormData();
        formData.append(
          'imgfile',
          f,
          `${uuid}` +
            TypeNameToBackendCode({
              name: 'artifact',
              slot: k as ArtifactSlots
            }).join('') +
            '_' +
            fileExt(f.name)
        );

        return Upload(formData).then((data) => {
          if (data.msg === 'OK') {
            return data.data.url;
          }
          return '';
        });
      }
    })
  );

  Object.values(slots).forEach((slot, index) => {
    if (filePath[index] !== '') {
      slot.imgUrl = filePath[index];
    }
  });

  return {
    id: id,
    uuid: uuid,
    name,
    rarity: rarity,
    slots: toRaw(slots),
    effects: effects
      .map((t, i) => ({
        limit: i + 1,
        describe: t
      }))
      .filter((i) => i.describe !== '')
  };
};

const previewCardGroup = ref(previewArtifactCard());

/**清空当前数据 */
const clear = () => {
  merge(basic, {
    id: -1,
    uuid: 0,
    name: ''
  });
  merge(slots, {
    FlowerOfLife: {
      imgUrl: '',
      name: '',
      describe: ''
    },
    PlumnOfDeath: {
      imgUrl: '',
      name: '',
      describe: ''
    },
    SandsOfEon: {
      imgUrl: '',
      name: '',
      describe: ''
    },
    GobletOfEonothem: {
      imgUrl: '',
      name: '',
      describe: ''
    },
    CircletOfLogos: {
      imgUrl: '',
      name: '',
      describe: ''
    }
  });
  merge(slotImageFile, {
    FlowerOfLife: undefined,
    PlumnOfDeath: undefined,
    SandsOfEon: undefined,
    GobletOfEonothem: undefined,
    CircletOfLogos: undefined
  });
  [...Array(4)].forEach((_i, index) => (effects[index] = ''));
};

const handleDrop = (text: string, file: File) => {
  if (file.type !== 'application/json') return;
  const data = JSON.parse(text);
  emits('change', -1);
  clear();

  basic.name = data.name;
  basic.uuid = Number(data.id);
  basic.rarity = data.rarity;

  data.effects.map((m: { limit: number; describe: string }) => {
    effects[m.limit - 1] = m.describe;
  });

  const islots = {
    FlowerOfLife: {
      imgUrl: '',
      name: '',
      describe: ''
    },
    PlumnOfDeath: {
      imgUrl: '',
      name: '',
      describe: ''
    },
    SandsOfEon: {
      imgUrl: '',
      name: '',
      describe: ''
    },
    GobletOfEonothem: {
      imgUrl: '',
      name: '',
      describe: ''
    },
    CircletOfLogos: {
      imgUrl: '',
      name: '',
      describe: ''
    }
  };

  type key = keyof typeof islots;

  data.slot.map((i: { type: ArtifactSlotsChinese; name: string; desc: string; story: string }) => {
    const p = {
      name: i.name,
      imgUrl: '',
      describe: i.desc
    };
    if (i.type) islots[ArtifactSlotsNameTransform(i.type) as key] = p;
  });

  merge(slots, islots);
};

const handleDropFiles = (files: { file: any; origin: File }[]) => {
  const mapper: { [key: string]: ArtifactSlots } = {
    _circlet: 'CircletOfLogos',
    _flower: 'FlowerOfLife',
    _goblet: 'GobletOfEonothem',
    _plume: 'PlumnOfDeath',
    _sands: 'SandsOfEon'
  };

  files.map((file) => {
    if (file.origin.type.startsWith('image')) {
      Object.keys(mapper).some((key) => {
        if (file.origin.name.toUpperCase().includes(key.toUpperCase())) {
          slots[mapper[key]].imgUrl = file.file;
          slotImageFile[mapper[key]] = file.origin;
          return true;
        }
        return false;
      });
    }
  });
};

const downLoadTemplate = (origin: object) => {
  const tmpLink = document.createElement('a');

  const blob = new File([JSON.stringify(origin, null, 2)], 'artifat_template.json', {
    type: 'text/plain'
  });

  const objectUrl = URL.createObjectURL(blob);
  tmpLink.href = objectUrl;

  tmpLink.download = 'artifat_template.json';

  tmpLink.click();
  URL.revokeObjectURL(objectUrl);
};

watchEffect(() => {
  if (store.artifactSuits.has(props.active)) {
    syncArtifact(store.ArtifactSuitById(props.active)!);
    previewCardGroup.value = previewArtifactCard();
  }
});

const download = () => {
  if (props.active !== -1 || basic.uuid !== 0) {
    const preDownload = {
      id: basic.id,
      uuid: basic.uuid,
      name: basic.name,
      rarity: basic.rarity,
      slots: toRaw(slots),
      effects: effects
        .map((t, i) => ({
          limit: i + 1,
          describe: t
        }))
        .filter((i) => i.describe !== '')
    };
    downLoadTemplate(preDownload);
  } else downLoadTemplate(template);
};
</script>

<template>
  <DropFile
    class="artifact-edit"
    v-drop="handleDrop"
    v-drop.files="handleDropFiles"
  >
    <template v-slot:default="willdrop">
      <div class="artifact-tool">
        <span
          >编辑器·{{ props.active !== -1 ? '修改' : '新建'
          }}{{ willdrop.willdrop ? '·释放新建' : '' }}</span
        >
        {{ basic.uuid ? `${basic.id}-${basic.uuid}` : '' }}
        <div>
          <button
            @click="
              () => {
                clear();
                emits('change', -1);
              }
            "
          >
            关闭
          </button>
          <button @click="download">
            下载{{ props.active !== -1 || basic.uuid !== 0 ? '数据' : '模板' }}
          </button>
          <button
            @click="
              async () => {
                const data = await buildSave();
                let res: any;
                if (props.active === -1) {
                  res = await ArtifactSuitAdd(data);
                  if (res.msg === 'OK') {
                    basic.id = res.data.id;
                  }
                } else {
                  res = await ArtifactSuitModify(basic.id, data);
                }
                if (res.msg === 'OK') store.GenerateArtifactSuits();
                else console.error('error');
              }
            "
          >
            保存
          </button>
        </div>
      </div>
      <ScrollView
        direction="x"
        scroll-behavior="scroll"
        transform-box-class="tsbox"
        style="height: 100%"
        v-if="props.active !== -1 || basic.uuid !== 0"
      >
        <ScrollView
          v-for="artifact of previewCardGroup"
          :key="artifact.type"
          :border="{ top: 100, bottom: 100 }"
          scroll-behavior="hidden"
        >
          <ArtifactDetailCard
            :size="40"
            v-bind="artifact"
          />
        </ScrollView>
      </ScrollView>
      <div
        class="artifact-content"
        v-else
      >
        <Icon
          :src="ArtifactPng"
          :size="120"
          type="projection"
          color="rgba(72, 85, 103,0.5)"
        />
      </div>
    </template>
  </DropFile>
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
    box-shadow: 0 0 10px @fontlightgray;
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
        color: @fontlightgray;
      }
      &:active {
        opacity: 0.8;
      }
    }
  }

  &-content {
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

.effects {
  width: 300px;
  height: 200px;
  font-size: 20px;
  color: @fontdarkgray;
  resize: none;
  border: none;
  box-shadow: @shadow2;

  &-box {
    display: flex;
    justify-content: space-between;
  }
}
</style>
