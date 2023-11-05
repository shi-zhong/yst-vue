<script setup lang="ts">
import {  reactive, ref, watch } from 'vue';
import { Drop } from '@/utils/directive';
import { Icon, ScrollView, DropFile } from '@/components';

import type {
  CharacterBasicModel,
  CharacterAttributeModel,
  CharacterTalentsModel,
  CharacterConstellationModel
} from '@/interface/characters';

import CharacterPng from '@/assets/icons/character.png';
import {
  DataDecoder,
  merge,
  VerifyType
} from '@/utils';
import { Message } from '@/components/commons/Message';

import Miyoushe from './miyoushe.json';
import { useCharacterDataStore } from '@/stores/Character';
import { useConfig } from '@/stores/config';

const { vDrop } = Drop();

const props = defineProps<{ active: number }>();
const emits = defineEmits<{ (e: 'change', id: number): void }>();

const store = useCharacterDataStore();
const config = useConfig()

const id = ref(0);

const uuid = ref(0);

const basic = reactive<CharacterBasicModel>({} as any);

const attributes = reactive<CharacterAttributeModel>({} as any);

const talents = ref<CharacterTalentsModel[]>([]);

const lives = ref<CharacterConstellationModel[]>([]);

const UploadCharacterInfo = async () => {
  const willupload = buildSave();
  let res: any;
  if (props.active === -1) {
    //
  } else {
    //
  }
};

const buildSave = () => ({
  id: id.value,
  uuid: uuid.value,
  basic: basic,
  attribute: attributes,
  talents: talents.value,
  lives: lives.value
});

/**--------------------------------- */
const handleDrop = (text: string, file: File) => {
  if (file.type !== 'application/json') return;

  const data = JSON.parse(text);

  if (VerifyType<any>(Miyoushe as any, data)) {
    //   emits('change', -1);
    uuid.value = data.uuid;
    lives.value = data.lives;

    merge(basic, {
      name: data.basic.name,
      star: data.basic.star,
      ...data.basic.attr,
      weapon: 1, // change
      element: '' //change
    });

    // 命座更新
    lives.value = data.life.map((l: any) => ({ ...l, imgurl: '' }));

    // 天赋更新
    talents.value = data.talent.skills.map((t: any) => ({
      type: t.type,
      name: t.name,
      intro: t.intro,
      detail: t.detail.map((d: string[]) => ({
        name: d[0],
        data: d.slice(1)
      }))
    }));

    const newAttr: any = {};

    Object.keys(data.lvls.attr).map((k) => {
      newAttr[k] = data.lvls.attr[k].map((n: string) => DataDecoder(n));
    });

    merge(attributes, {
      data: newAttr,
      breakthrouth: data.lvls.breakthrouth,
      specialty: data.lvls.material.specialty
    });

    Message.success('米游社文件格式.');
  } else {
    Message.success('文件格式不符!');
  }
};

watch(
  () => props.active,
  () => {},
  { immediate: true }
);
</script>

<template>
  <DropFile
    class="weapon-editor"
    v-drop="handleDrop"
  >
    <template v-slot:default="willdrop">
      <div class="weapon-tool">
        <span
          >编辑器·{{ props.active !== -1 ? '修改' : '新建'
          }}{{ willdrop.willdrop ? '·释放新建' : '' }}</span
        >
        {{ id ? `${id}-${uuid}` : '' }}
        <div>
          <button
            @click="
              () => {
                emits('change', -1);
                id = 0;
                uuid = 0;
              }
            "
          >
            关闭
          </button>
          <button @click="UploadCharacterInfo">保存</button>
        </div>
      </div>

      <div
        class="weapon-edit"
        v-if="props.active !== -1 || uuid !== 0"
      >
        <ScrollView
          class="weapon-scroll"
          scroll-behavior="hidden"
        >
        <!--  -->
        </ScrollView>
      </div>
      <div
        class="weapon-blank"
        v-else
      >
        <Icon
          :src="CharacterPng"
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
  width: 200px;
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

.display-modify {
  color: @fontlightgray;

  & > tr > td {
    width: 50%;
    min-height: 100px;
    padding: 10px;
  }
}

.arrow {
  width: 200px;
}
.weapon {
  &-editor {
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
    overflow: hidden;
  }

  &-edit {
    display: flex;
    justify-content: space-between;
    height: 100%;
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
    flex-grow: 1;
    padding: 3px;
  }
}
</style>
