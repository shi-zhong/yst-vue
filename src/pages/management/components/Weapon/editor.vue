<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
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
import { UploadImg, WeaponTypeAdd, WeaponTypeModify } from '@/api';
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
import ArrowCount from '@@/ArrowCount/index.vue';
import { useWeaponStore, emptyWeaponTypes as template } from '@/stores/Weapon';
import { emit } from 'process';

const { vDrop } = Drop();

const props = defineProps<{ active: number }>();
const emits = defineEmits<{ (e: 'change', id: number): void }>();

const store = useWeaponStore();

const id = ref(0);
const uuid = ref(0);

const basic = reactive<{
  name: string;
  star: 1 | 2 | 3 | 4 | 5;
  type: number;
  imgUrl: string;
}>({
  name: '',
  star: 1,
  type: 0,
  imgUrl: ''
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

const UploadWeaponImg = async () => {
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

    const { code, data } = await UploadImg(formData);
    if (code === 20000) {
      basic.imgUrl = data.url;
      return true;
    } else {
      Message.info('上传图片失败.');
    }
  }
  return false;
};

const UploadWeaponInfo = async () => {
  // 有文件必须先上传
  if (weaponImgFile.value) {
    const uploaded = await UploadWeaponImg();
    if (!uploaded) return;
  } else if (!basic.imgUrl.startsWith('http')) {
    return;
  }

  const willupload = buildSave();
  let res: any;
  if (props.active === -1) {
    res = await WeaponTypeAdd(willupload);
    if (res.msg === 'OK') {
      await store.GenerateWeaponTypes();
      id.value = res.data.id;
      emits('change', res.data.id);
    }
  } else {
    res = await WeaponTypeModify(props.active, willupload);
    store.GenerateWeaponTypes();
  }
};

const buildSave = (): WeaponTypeModel => ({
  id: id.value,
  uuid: uuid.value,
  basic,
  describe: describe.value,
  data: weaponData,
  story: story.value,
  effect: effect
});

const buildPreview: any = computed(() => ({
  id: 0,
  basic: basic,
  describe: describe.value,
  data: weaponData,
  story: story.value,
  effect: effect
}));

/**--------------------------------- */
const handleJsonDrop = (text: string) => {
  const data = JSON.parse(text);

  weaponImgFile.value = undefined;
  basic.imgUrl = '';

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
              { type: 'string', name: 'imgUrl' }
            ]
          },
          { type: 'string', name: 'describe' },
          {
            type: 'object',
            name: 'effect',
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
    emits('change', -1);
    id.value = 0;
    uuid.value = data.uuid;
    merge(basic, data.basic);
    describe.value = data.describe;
    merge(effect, data.effect);
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
            name: 'effect',
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
    emits('change', -1);

    id.value = 0;
    uuid.value = res.uuid;
    merge(basic, res.basic);
    describe.value = res.describe;
    merge(effect, res.effect);
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
    basic.imgUrl = text;
  }
};

const download = () => {
  if (props.active !== -1 || uuid.value !== 0) {
    DownLoadJson(buildSave(), `${basic.name ?? 'weapon'}.json`);
  } else DownLoadJson(template, 'weapon_template.json');
};

watch(
  () => props.active,
  () => {
    if (props.active !== -1) {
      const weapon = store.WeaponTypeById(props.active);
      if (weapon.id === 0) {
        Message.error('ID 错误.');
      } else {
        uuid.value = weapon.uuid;
        merge(basic, weapon.basic);
        describe.value = weapon.describe;
        merge(effect, weapon.effect);
        merge(weaponData, weapon.data);
        story.value = weapon.story || ([] as string[]);
      }
    }
  },
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
          <button @click="download">
            下载{{ props.active !== -1 || uuid !== 0 ? '数据' : '模板' }}
          </button>
          <button @click="UploadWeaponInfo">保存</button>
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
          <table class="display-modify">
            <tr>
              <td>状态锁定</td>
              <td>
                <Lock
                  v-model="lock"
                  :size="40"
                />
              </td>
            </tr>
            <tr>
              <td>修改等级</td>
              <td>
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
              </td>
            </tr>
            <tr>
              <td>修改精炼</td>
              <td>
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
              </td>
            </tr>
            <tr>
              <td>小卡片预览</td>
              <td>
                <WeaponCard
                  :imgUrl="basic.imgUrl"
                  :lvl="level"
                  :locked="lock"
                  :rarity="basic.star"
                />
              </td>
            </tr>
          </table>
        </ScrollView>

        <ScrollView style="width: 420px;max-height: 700px;">
          <WeaponDetailCard
            :size="40"
            :id="0"
            :type_id="id"
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
