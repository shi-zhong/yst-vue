<script setup lang="ts">
import { Lock, RankBar, Refine } from '@/components/Tags';
import { BasicDetailCard } from '@/components/DetailCard';
import { ClassNameFactor, DataDecoder, TypeNameToBackendCode } from '@/utils';
import {
  WeaponTypesTransform,
  type WeaponTypeModel,
  type WeaponsInstanceModel
} from '@/components/Weapon';

import { reactive, toRefs, watch } from 'vue';
import { merge } from '@/utils';
import WeaponDescribe from './WeaponDescribe.vue';
import { computed } from 'vue';
import { AttributesTransform } from '@/components/Artifact';

const props = withDefaults(
  defineProps<WeaponsInstanceModel & { weapon_type?: WeaponTypeModel; size?: number }>(),
  {
    size: 50
  }
);

const { rank, lvl, refine } = toRefs(props);

const data = reactive<WeaponTypeModel>({
  id: 0,
  uuid: 0,
  basic: {
    name: '',
    star: 1,
    type: 1,
    imgurl: ''
  },
  describe: '',
  data: {
    main: [],
    sub: {
      key: 'ATKPercentage',
      start: 0,
      growth: 0
    }
  },
  story: [],
  effects: {
    name: '',
    describe: '',
    $: []
  }
});

const S = ClassNameFactor('weapon-detail-card-');

const mainValue = computed(() => {
  /**
   * 等级和阶级不一致时，优先处理等级
   * main [1, 20, 20+, 40, 40+, 50, 50+, 60, 60+, 70, 70+, 80, 80+, 90]
   */
  const lvls = [1, 20, 20, 40, 40, 50, 50, 60, 60, 70, 70, 80, 80, 90];
  const ranks = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
  for (let i = 0; i < data.data.main.length; i++) {
    if (lvls[i] === lvl.value && ranks[i] === rank.value) {
      return data.data.main[i];
    }
  }
  return data.data.main[lvls.findIndex((j) => j === lvl.value)] ?? 0;
});

watch(
  [() => props.type_id, () => props.weapon_type],
  () => {
    if (props.type_id === 0 && props.weapon_type !== undefined) {
      merge(data, props.weapon_type);
    } else {
      merge(data, {});
    }
  },
  { immediate: true }
);
</script>

<!-- @todo 属性数值部分转换 -->
<template>
  <BasicDetailCard
    :title="data.basic.name"
    :rarity="data.basic.star"
    :main="{ key: '基础攻击力', value: DataDecoder(mainValue) }"
    :sub="{
      key: AttributesTransform(data.data.sub.key),
      value: DataDecoder(lvl * data.data.sub.growth + data.data.sub.start)
    }"
    :imgurl="data.basic.imgurl"
    :type="
      WeaponTypesTransform(TypeNameToBackendCode({ name: 'weapon', code: data.basic.type })[1])
    "
    :size="size"
  >
    <div :class="S('lvl-container')">
      <div style="display: flex">
        <span :class="S('lvl')">
          Lv.{{ lvl }}&nbsp;<span style="color: rgb(161, 170, 177)"
            >/&nbsp;{{ [20, 40, 50, 60, 70, 80, 90][rank] }}</span
          ></span
        >
        &nbsp;
        <RankBar
          :rank="rank"
          :size="21"
        />
      </div>
      <Lock
        :size="(30 / 50) * size"
        :lock="lock"
      />
    </div>
    <Refine
      v-if="refine !== 0 && data.effects.$.length !== 0"
      :refine="refine"
      :refine-end="refine === data.effects.$[0].length"
      :size="23"
      :text="true"
    />
    <WeaponDescribe
      :class="S('effect-describe')"
      :refine="refine"
      :effect="data.effects"
    />
    <div :class="S('txt-describe')">{{ data.describe }}</div>
  </BasicDetailCard>
</template>

<style scoped lang="less">
.weapon-detail-card {
  &-attributes > div {
    color: @fontdarkgray;
    font-size: var(--attribute-size);
    margin: 4px 0;
  }

  &-effect-describe {
    color: @fontdarkgray;
    font-size: var(--attribute-size);
    margin-top: 15px;
  }

  &-txt-describe {
    margin-top: 10px;
    font-size: var(--attribute-size);
    color: @fontlightgray;
  }

  &-lvl {
    &-container {
      display: flex;
      justify-content: space-between;
      align-items: center;

      height: 50px;
    }
    display: inline-block;
    // margin: 0 10px;
    padding: 0 10px;
    border-radius: 3px;
    background-color: @shadow;
    font-size: calc(var(--attribute-size) * 0.8);

    color: @blank-white;
  }
}
</style>
