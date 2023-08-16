<script setup lang="ts">
import { reactive, ref, toRaw, watchEffect } from 'vue';
import { Drop } from '@/utils/directive';
import { Rarity, Icon, ScrollView, DropImage } from '@/components';
import {
  type ArtifactSuitModel,
  ArtifactSlotsToChinese,
  ArtifactSlotsToEnglish,
  type ArtifactSlotsChinese,
  type ArtifactSlots
} from '@/components/Artifact';
import { useArtifactStore } from '@/stores/Artifact';
import { Upload } from '@/api/Request';
import ArrowPng from '@/assets/icons/arrow.png';

import { merge, mapper, fileExt } from '@/utils';
import { ArtifactSuitAdd, ArtifactSuitModify } from '@/api/ArtifactSuit';

const props = defineProps<{ active: number }>();
const emits = defineEmits<{ (e: 'change', id: number): void }>();
const store = useArtifactStore();
const basic = reactive({
  id: -1,
  uuid: 0,
  name: ''
});
const rarity = ref<1 | 2 | 3 | 4 | 5>(1);
const slots = reactive({
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

const syncArtifact = (artifact: ArtifactSuitModel) => {
  merge(basic, {
    id: store.uuidMapId.get(artifact.id) || -1,
    uuid: artifact.id,
    name: artifact.name
  });
  rarity.value = artifact.rarity;
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

const buildSave = async (): Promise<ArtifactSuitModel> => {
  const { uuid, name } = toRaw(basic);

  const filePath = await Promise.all(
    Object.entries(slotImageFile).map(([k, f]) => {
      if (f === undefined) return Promise.resolve('');
      else {
        const formData = new FormData();
        formData.append(
          'imgfile',
          f,
          `${uuid}` +
            mapper({
              name: 'artifact',
              slot: k as ArtifactSlots
            }) +
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
    id: uuid,
    name,
    rarity: rarity.value,
    slots: toRaw(slots),
    effects: effects
      .map((t, i) => ({
        limit: i + 1,
        describe: t
      }))
      .filter((i) => i.describe !== '')
  };
};

const { vDrop } = Drop();

const clear = () => {
  merge(basic, {
    id: 0,
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
  Array(4).forEach((_i, index) => (effects[index] = ''));
};

const handleDrop = (text: string) => {
  const data = JSON.parse(text);
  emits('change', -1);
  clear();

  basic.name = data.name;
  basic.uuid = Number(data.id);
  rarity.value = data.rarity;

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
    if (i.type) islots[ArtifactSlotsToEnglish(i.type) as key] = p;
  });

  merge(slots, islots);
};

watchEffect(() => {
  if (store.artifactSuits.has(props.active)) {
    syncArtifact(store.artifactSuits.get(props.active)!);
  }
});
</script>

<template>
  <div
    class="artifact-edit"
    v-drop="handleDrop"
  >
    <div class="artifact-tool">
      <span>编辑器·{{ props.active !== -1 ? '修改' : '新建' }}</span>
      <div>
        <button @click="() => {}">预览</button>
        <button
          @click="
            async () => {
              const data = await buildSave();
              let res: any;
              if (props.active === -1) {
                res = await ArtifactSuitAdd(data);
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
    <div class="artifact-basic">
      <input
        type="number"
        class="inputtext"
        v-model="basic.uuid"
        placeholder="ID"
        min="0"
        max="9999"
      />
      <input
        type="text"
        class="inputtext"
        v-model="basic.name"
        placeholder="套装名称"
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
      <div @mousedown="(e) => stopPropation(e)">
        <div
          v-for="(slot, key) in slots"
          :key="key"
          class="artifact-slot"
        >
          <div>
            <div>{{ ArtifactSlotsToChinese(key) }}</div>
            <div>
              <input
                type="text"
                class="inputtext"
                v-model="slot.name"
                placeholder="圣遗物名称"
              />
            </div>
          </div>

          <textarea
            v-model="slot.describe"
            placeholder="圣遗物描述"
            cols="30"
            rows="10"
          />
          <DropImage
            v-model="slotImageFile[key]"
            style="height: 120px; width: 120px"
            :size="120"
            :src="slot.imgUrl"
          />
          <button
            @click="
              () => {
                slot.describe = '';
                slot.imgUrl = '';
                slot.name = '';
              }
            "
          >
            清除
          </button>
        </div>
        <div class="effects-box">
          <textarea
            class="effects"
            placeholder="1件套效果"
            v-model="effects[0]"
          />
          <textarea
            class="effects"
            placeholder="2件套效果"
            v-model="effects[1]"
          />
          <textarea
            class="effects"
            placeholder="4件套效果"
            v-model="effects[3]"
          />
        </div>
      </div>
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
