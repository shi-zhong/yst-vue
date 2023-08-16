<script setup lang="ts">
import { Lock } from '@/components/Tags';
import { BasicDetailCard, type BasicDetailCardProps } from '@/components/DetailCard';
import { WeaponTypesToChinese, type WeaponsTypes } from '@/components/Weapon';
import { ClassNameFactor } from '@/utils/className';
import { reactive, toRefs, watch } from 'vue';
import { merge } from '@/utils';

interface WeaponCardProps extends BasicDetailCardProps {
  type: WeaponsTypes;
}

const props = defineProps<WeaponCardProps>();

const { sub, main, type, rarity, imgurl, title } = toRefs(props);

// const data = reactive(ArtifactEffectSearch(props.id));

// watch(
//   () => props.id,
//   () => {
//     merge(data, ArtifactEffectSearch(props.id));
//   }
// );
</script>

<template>
  <BasicDetailCard
    :title="title"
    :rarity="rarity"
    :sub="sub"
    :main="main"
    :imgurl="imgurl"
    :type="WeaponTypesToChinese(type)"
  >
    <!-- <div :class="S('describe')">
      <div :class="S('lvl-container')">
        <div :class="S('lvl')">+{{ props.lvl }}</div>
        <Lock
          :size="30"
          :lock="props.lock"
        />
      </div>
      <div :class="S('attributes')">
        <div
          v-for="i in subs"
          :key="i.key + i.value"
        >
          {{ ' · ' }}
          {{ i.key }}+{{ i.value }}
        </div>
      </div>
      <Describe
        :class="S('effect-describe')"
        :id="props.id"
        :active="suitCount"
      />
      <div :class="S('txt-describe')">{{ data.slots[props.type]!.describe }}</div>
    </div> -->
  </BasicDetailCard>
</template>

<style scoped lang="less">
.weapon-detail-card {
  &-attributes > div {
    color: @fontdarkgray;
    font-size: 22px;
    margin: 4px 0;
  }

  &-effect-describe {
    font-size: 22px;
    margin-top: 15px;
  }

  &-txt-describe {
    margin-top: 10px;
    font-size: 22px;
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
    font-size: 18px;

    color: @blank-white;
  }
}
</style>
