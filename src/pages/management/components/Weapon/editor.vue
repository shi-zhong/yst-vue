<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Drop } from '@/utils/directive';
import { Icon, ScrollView, DropFile, Refine, Lock } from '@/components';
import {
  WeaponTypesTransform,
  WeaponCard,
  type WeaponTypeModel,
  WeaponDetailCard,
  type WeaponSubArrtibutes,
  RankFromVerify,
  LevelFromVerify,
  VerifyRankAndLevel,
  StarToMaxRank,
  StarToMaxLevel
} from '@@/Weapon';
import { Upload, WeaponTypeAdd, WeaponTypeModify } from '@/api';
import WeaponPng from '@/assets/icons/weapon.png';
import {
  DataDecoder,
  DownLoadJson,
  fileExt,
  merge,
  TypeNameToBackendCode,
  VerifyType,
  ReadTypeFrom,
  TypeTransfer
} from '@/utils';
import { Message } from '@/components/commons/Message';
import { AttributesTransform } from '@@/Artifact';
import { template } from './temp';
import ArrowCount from '@@/ArrowCount/index.vue';

const { vDrop } = Drop();

const props = defineProps<{ active: number }>();
const emits = defineEmits<{ (e: 'change', id: number): void }>();

const id = ref(0);
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
    key: WeaponSubArrtibutes;
    start: number;
    growth: number;
  };
}>({
  main: [],
  sub: {
    key: 'ATKPercentage',
    start: 0,
    growth: 0
  }
});

const story = ref<string[]>([]);

const rankwithlevel = ref(0);

const rank = computed(() => RankFromVerify(rankwithlevel.value));
const level = computed(() => LevelFromVerify(rankwithlevel.value));
const lock = ref(true);
const refine = ref(0);

// const clear = async () => {
//   id.value = 1;
//   uuid.value = 0;
//   merge(basic, {
//     name: '',
//     star: 1,
//     type: 0,
//     imgurl: ''
//   });

//   weaponImgFile.value = undefined;
//   describe.value = '';
//   merge(effect, {
//     name: '',
//     describe: '',
//     $: []
//   });

//   merge(weaponData, {
//     main: [],
//     sub: {
//       key: 'ATKPercentage',
//       start: 0,
//       growth: 0
//     }
//   });
// };

/**-------------------------------------------------- */
const UploadImg = async () => {
  if (weaponImgFile.value) {
    const formData = new FormData();
    formData.append(
      'imgfile',
      weaponImgFile.value,
      `${uuid.value}${
        TypeNameToBackendCode({
          name: 'weapon',
          type: 'Bow'
        })[0]
      }${basic.type}_${fileExt(weaponImgFile.value.name)}`
    );
    const { msg, data } = await Upload(formData);
    if (msg === 'OK') {
      basic.imgurl = data.url;
    } else {
      Message.info('上传图片失败.');
    }
  }
};

const buildSave = (): WeaponTypeModel => ({
  id: id.value,
  uuid: uuid.value,
  basic,
  describe: describe.value,
  data: weaponData,
  story: story.value,
  effects: effect
});

const buildPreview: any = computed(() => ({
  id: 0,
  basic: basic,
  describe: describe.value,
  data: weaponData,
  story: story.value,
  effects: effect
}));

/**--------------------------------- */
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
              { type: 'string', name: 'imgurl' }
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
    Message.success('原神工具格式.');
  } else if (
    VerifyType(
      ReadTypeFrom({
        id: 5887,
        basic: { name: '裁萃光', star: 5, type: '' },
        describe: {
          describe: '',
          name: '',
          effect: '',
          $: [['4%', '5%', '6%', '7%', '8%']]
        },
        lvldata: [
          {
            name: '',
            basic: [{ value: '' }, { value: '' }]
          }
        ],
        story: ['']
      }),
      data
    )
  ) {
    const res = TypeTransfer<WeaponTypeModel>(
      {
        type: 'object',
        items: [
          {
            name: 'uuid',
            path: 'id',
            type: 'direct'
          },
          {
            name: 'basic',
            path: 'basic',
            type: 'object',
            items: [
              {
                name: 'name',
                type: 'direct'
              },
              {
                name: 'star',
                type: 'direct'
              },
              {
                name: 'type',
                type: 'direct',
                mapper: (type) =>
                  TypeNameToBackendCode({
                    name: 'weapon',
                    type: WeaponTypesTransform(type) as any
                  })[1]
              }
            ]
          },
          {
            name: 'describe',
            type: 'direct',
            path: 'describe.describe'
          },
          {
            name: 'effects',
            path: 'describe',
            type: 'object',
            items: [
              {
                name: 'describe',
                path: 'describe.effect',
                type: 'direct'
              },
              {
                name: 'name',
                type: 'direct'
              },
              {
                name: '$',
                type: 'direct',
                mapper: ($: string[][]) => $.map((c: string[]) => c.map((i) => DataDecoder(i)))
              }
            ]
          },
          {
            name: 'data',
            path: 'lvldata',
            type: 'direct',
            mapper: (i) => {
              const data = {
                main: [] as number[],
                sub: {
                  key: '',
                  start: 0,
                  growth: 0
                }
              };
              i.map((lvl: any, index: number) => {
                lvl.basic.map(({ value }: { value: string }) => {
                  if (/基础攻击力/.test(value)) {
                    data.main.push(Number(value.split(':')[1]));
                  } else {
                    if (index === 0) {
                      const pair: any[] = value.split(':').map((j) => j.trim());
                      data.sub.key = AttributesTransform(pair[0] as any);
                      data.sub.start = DataDecoder(pair[1]);
                    } else if (index === i.length - 1) {
                      const pair: any[] = value.split(':').map((j) => j.trim());
                      data.sub.growth = DataDecoder(pair[1]);
                    }
                  }
                });
                if (index === i.length - 1) {
                  const maxlevel = Number(lvl.name.slice(0, -1));
                  data.sub.growth = (data.sub.growth - data.sub.start) / (maxlevel - 1);
                }
              });
              return data;
            }
          },
          {
            name: 'story',
            type: 'direct'
          }
        ]
      },
      data as object
    );

    uuid.value = res.uuid;
    merge(basic, res.basic);
    describe.value = res.describe;
    merge(effect, res.effects);
    merge(weaponData, res.data);
    story.value = res.story || ([] as string[]);

    Message.success('米游社文件格式.');
  } else {
    Message.success('文件格式不符!');
  }
};

const handleDrop = (text: string, file: File) => {
  if (file.type === 'application/json') return handleJsonDrop(text);
  else if (file.type.startsWith('image')) {
    weaponImgFile.value = file;
    basic.imgurl = text;
  }
};

const download = () => {
  if (props.active !== -1 || uuid.value !== 0) {
    DownLoadJson(buildSave(), `${basic.name ?? 'weapon'}.json`);
  } else DownLoadJson(template, 'weapon_template.json');
};
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
                await UploadImg();
                const willupload = buildSave();
                let res: any;
                if (props.active === -1) {
                  res = await WeaponTypeAdd(willupload);
                  if (res.msg === 'OK') {
                    id = res.data.id;
                  }
                } else {
                  res = await WeaponTypeModify(id, willupload);
                }
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
          transformBoxClass="left-controler"
        >
          <Lock
            v-model="lock"
            :size="40"
          />
          <ArrowCount
            class="arrow"
            :min="0"
            :max="VerifyRankAndLevel(StarToMaxRank(basic.star), StarToMaxLevel(basic.star))"
            v-model="rankwithlevel"
          >
            {{
              [
                '1',
                '20',
                '20+',
                '40',
                '40+',
                '50',
                '50+',
                '60',
                '60+',
                '70',
                '70+',
                '80',
                '80+',
                '90'
              ][rankwithlevel]
            }}
          </ArrowCount>
          <ArrowCount
            class="arrow"
            :min="0"
            :max="effect.$[0]?.length ?? 0"
            v-model="refine"
          >
            <Refine
              :refine="refine"
              text
              :refineEnd="refine === effect.$[0]?.length ?? 0"
            />
          </ArrowCount>
        </ScrollView>
        <WeaponCard
          :imgurl="basic.imgurl"
          :lvl="level"
          :locked="lock"
          :rarity="basic.star"
        />
        <ScrollView style="width: 420px">
          <WeaponDetailCard
            :size="40"
            :id="id"
            :type_id="uuid"
            :rank="(rank as any)"
            :lvl="(level as any)"
            :refine="(refine as any)"
            :lock="lock"
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

:deep(.left-controler) {
  display: flex;
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
./temp
