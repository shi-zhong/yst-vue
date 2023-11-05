<script setup lang="ts">
import { Lock, RankBar, Refine } from '@/components/Tags';
import { BasicDetailCard } from '@/components/DetailCard';
import { ClassNameFactor, DataDecoder } from '@/utils';
import {
  WeaponTypesTransform,
  type WeaponTypeModel,
  type WeaponsInstanceModel,
  VerifyRankAndLevel,
  StarToMaxRank
} from '@/components/Weapon';

import { reactive, toRefs, watch } from 'vue';
import { merge } from '@/utils/tools';
import WeaponDescribe from './WeaponDescribe.vue';
import { AttributesTransform } from '@/components/Artifact';
import { useWeaponStore } from '@/stores/Weapon';
import { useConfig } from '@/stores/config';

const props = withDefaults(
  defineProps<WeaponsInstanceModel & { weapon_type?: WeaponTypeModel; size?: number }>(),
  {
    size: 50
  }
);

const store = useWeaponStore();

const config = useConfig();

const { rank, lvl, refine } = toRefs(props);

const data = reactive<WeaponTypeModel>({
  id: 0,
  uuid: 0,
  basic: {
    name: '',
    star: 1,
    type: 1,
    imgUrl: ''
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
  effect: {
    name: '',
    describe: '',
    $: []
  }
});

const S = ClassNameFactor('weapon-detail-card-');

watch(
  [() => props.type_id, () => props.weapon_type],
  () => {
    if (props.type_id === 0 && props.weapon_type !== undefined) {
      merge(data, props.weapon_type);
    } else {
      const weapon = store.WeaponTypeById(props.type_id);
      merge(data, weapon);
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
    :main="{
      key: '基础攻击力',
      value: DataDecoder(data.data.main[VerifyRankAndLevel(rank, lvl)])
    }"
    :sub="{
      key: AttributesTransform(data.data.sub.key),
      value: DataDecoder((lvl - 1) * data.data.sub.growth + data.data.sub.start, 1)
    }"
    :imgUrl="data.basic.imgUrl"
    :type="WeaponTypesTransform(config.weaponTypeCode(data.basic.type)) ?? '单手剑'"
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
          :max-rank="StarToMaxRank(data.basic.star)"
          :size="21"
        />
      </div>
      <Lock
        :size="(30 / 50) * size"
        :lock="lock"
      />
    </div>
    <Refine
      v-if="refine !== 0 && data.effect.$.length !== 0"
      :refine="refine"
      :refine-end="refine === data.effect.$[0].length"
      :size="23"
      :text="true"
    />
    <WeaponDescribe
      :class="S('effect-describe')"
      :refine="refine"
      :effect="data.effect"
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
