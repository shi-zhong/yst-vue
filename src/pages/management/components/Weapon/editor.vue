<script setup lang="ts">
import { computed, reactive, ref, toRaw, watchEffect } from 'vue';
import { Drop } from '@/utils/directive';
import { Rarity, Icon, ScrollView, DropImage, DropFile } from '@/components';
import {
  WeaponTypesTransform,
  type WeaponTypesChinese,
  type WeaponTypeModel,
  WeaponDetailCard
} from '@/components/Weapon';

import { Upload } from '@/api/Request';
import ArrowPng from '@/assets/icons/arrow.png';
import WeaponPng from '@/assets/icons/weapon.png';

import { DataDecoder, merge, TypeNameToBackendCode } from '@/utils';
import { VerifyType } from '@/utils/types';

const { vDrop } = Drop();

const props = defineProps<{ active: number }>();
const emits = defineEmits<{ (e: 'change', id: number): void }>();

const id = ref(1);
const uuid = ref(0);

const basic = reactive<{
  name: string;
  star: 1 | 2 | 3 | 4 | 5;
  type: number;
  imgurl: string;
}>({
  name: '',
  star: 1,
  type: 0,
  imgurl: ''
});
const weaponImgFile = ref<File>();
const describe = ref('');
const effect = reactive<{
  name: string;
  describe: string;
  $: number[][];
}>({
  name: '',
  describe: '',
  $: []
});
const weaponData = reactive<{
  main: number[];
  sub: {
    key: string;
    start: number;
    growth: number;
  };
}>({
  main: [],
  sub: {
    key: 'string',
    start: 0,
    growth: 0
  }
});

const story = ref<string[]>([]);

/**-------------------------------------------------- */

const stopPropation = (e: Event) => {
  if ((e.target! as any).nodeName === 'TEXTAREA' || (e.target! as any).nodeName === 'INPUT') {
    e.stopPropagation();
  }
};

const buildSave = async () => {
  // const { uuid, name } = toRaw(basic);
  // const filePath = await Promise.all(
  //   Object.entries(slotImageFile).map(([k, f]) => {
  //     if (f === undefined) return Promise.resolve('');
  //     else {
  //       const formData = new FormData();
  //       formData.append(
  //         'imgfile',
  //         f,
  //         `${uuid}` +
  //           mapper({
  //             name: 'weapon',
  //             slot: k as ArtifactSlots
  //           }).join('') +
  //           '_' +
  //           fileExt(f.name)
  //       );
  //       return Upload(formData).then((data) => {
  //         if (data.msg === 'OK') {
  //           return data.data.url;
  //         }
  //         return '';
  //       });
  //     }
  //   })
  // );
  // Object.values(slots).forEach((slot, index) => {
  //   if (filePath[index] !== '') {
  //     slot.imgUrl = filePath[index];
  //   }
  // });
  return {
    id: 0,
    basic: { name: '狼的末日', star: 5, type: 3, imgurl: 'I' },
    describe:
      '狼的骑士所使的大剑。原本只是城中铁匠赠予的厚重的铁片，却在他与狼的情谊中，获得神话般的力量。',
    data: { main: [], sub: { key: 'string', start: 0, growth: 0 } },
    story: [],
    effects: {
      name: '如狼般狩猎者',
      describe:
        ' · 攻击力提高$1；攻击命中生命值低于30%的敌人时队伍中所有成员的攻击力提高$2，持续12秒。该效果30秒只能触发一次。',
      $: [
        ['20%', '25%', '30%', '35%', '40%'],
        ['40%', '50%', '60%', '70%', '80%']
      ]
    }
  };
};

const buildPreview: any = computed(() => ({
  id: 0,
  basic: basic,
  describe: describe.value,
  data: weaponData,
  story: story.value,
  effects: effect
}));

/**--------------------------------- */
const TransformMiYouSheData = () => {
  // basic.name = data.basic.name;
  // basic.star = data.basic.star;
  // basic.type = TypeNameToBackendCode({
  //   type: WeaponTypesTransform(data.basic.type as WeaponTypesChinese),
  //   name: 'weapon'
  // })[1];
  // basic.imgurl = data.basic.imgurl;
  // const main = [] as string[];
  // const sub = {
  //   key: '',
  //   group: [] as string[]
  // };
  // if (data.lvldata instanceof Array) {
  //   data.lvldata.map((lvl: any, index: number) => {
  //     if (lvl.basic instanceof Array) {
  //       if (index === 0 || index === data.lvldata.length - 1) {
  //         main.push(lvl.basic[0]?.value ?? '');
  //       } else {
  //         main.push(lvl.basic[0]?.value ?? '');
  //         main.push(lvl.basic[1]?.value ?? '');
  //       }
  //       sub.group.push(lvl.basic[lvl.basic.length - 1].value);
  //     }
  //   });
  // } else {
  //   console.error('lvldata');
  // }
  // const effectData = {
  //   name: data.describe.name,
  //   describe: data.describe.effect,
  //   $: [] as number[][]
  // };
  // for (let i = 1; i <= Object.keys(data.describe).length - 3; i++) {
  //   if (data.describe[`$${i}`] !== undefined) {
  //     effectData.$.push(data.describe[`$${i}`].map((i: string) => DataDecoder(i)));
  //   } else {
  //     break;
  //   }
  // }
};

const handleJsonDrop = (text: string) => {
  const data = JSON.parse(text);

  if (
    VerifyType<WeaponTypeModel>(
      {
        type: 'object',
        items: [
          { type: 'number', name: 'id' },
          { type: 'number', name: 'uuid' },
          {
            type: 'object',
            name: 'basic',
            items: [
              { type: 'string', name: 'name' },
              { type: 'number', name: 'star' },
              { type: 'number', name: 'type' },
              { type: 'number', name: 'imgurl' }
            ]
          },
          { type: 'string', name: 'describe' },
          {
            type: 'object',
            name: 'effects',
            items: [
              { type: 'string', name: 'name' },
              { type: 'string', name: 'describe' },
              {
                type: 'array',
                name: '$',
                each: {
                  type: 'array',
                  each: {
                    type: 'number'
                  }
                }
              }
            ]
          },
          {
            type: 'object',
            name: 'data',
            items: [
              { type: 'array', name: 'main', each: { type: 'number' } },
              {
                type: 'object',
                name: 'sub',
                items: [
                  { type: 'string', name: 'key' },
                  { type: 'number', name: 'start' },
                  { type: 'number', name: 'growth' }
                ]
              }
            ]
          },
          {
            type: 'array',
            name: 'story',
            each: { type: 'string' }
          }
        ]
      },
      data
    )
  ) {
    uuid.value = data.uuid;
    merge(basic, data.basic);
    describe.value = data.describe;
    merge(effect, data.effects);
    merge(weaponData, data.data);
    story.value = data.story || ([] as string[]);
  }
};

const handleDrop = (text: string, file: File) => {
  if (file.type === 'application/json') return handleJsonDrop(text);
  else if (file.type.startsWith('image')) {
    weaponImgFile.value = file;
    basic.imgurl = text;
  }
};

const download = () => {};
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
          <button @click="() => emits('change', -1)">关闭</button>
          <button @click="download">
            下载{{ props.active !== -1 || uuid !== 0 ? '数据' : '模板' }}
          </button>
          <button
            @click="
              async () => {
                // const data = await buildSave();
                // let res: any;
                // if (props.active === -1) {
                //   res = await ArtifactSuitAdd(data);
                //   if (res.msg === 'OK') {
                //     basic.id = res.data.id;
                //   }
                // } else {
                //   res = await ArtifactSuitModify(basic.id, data);
                // }
                // if (res.msg === 'OK') store.GenerateArtifactSuits();
                // else console.error('error');
              }
            "
          >
            保存
          </button>
        </div>
      </div>

      <div
        v-if="props.active !== -1 || uuid !== 0"
        class="weapon-edit"
      >
        <ScrollView
          class="weapon-scroll"
          scroll-behavior="hidden"
        >
        </ScrollView>
        <ScrollView style="width: 420px">
          <WeaponDetailCard
            :size="40"
            :id="0"
            :type_id="0"
            :rank="6"
            :lvl="90"
            :refine="0"
            :lock="true"
            :weapon_type="buildPreview"
          />
        </ScrollView>
      </div>
      <div
        class="weapon-blank"
        v-else
      >
        <Icon
          :src="WeaponPng"
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
