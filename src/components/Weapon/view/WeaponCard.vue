<script setup lang="ts">
import { Card as BasicCard, Lock, Refine } from '@shi-zhong/genshin-ui';
import { useConfig } from '@/stores/config';

interface WeaponCardProps {
  locked: boolean;
  imgUrl: string;
  star: 1 | 2 | 3 | 4 | 5;
  lvl: number;
  name?: string;
  refine?: number;
  refineEnd?: boolean;
}

const props = defineProps<WeaponCardProps>();
const config = useConfig();
</script>

<template>
  <BasicCard
    type="weapon"
    :star="star"
    :imgUrl="config.weaponImage(props.imgUrl)"
    :desc="lvl ? `Lv.${lvl}` : name ?? ''"
  >
    <Refine
      v-if="refine"
      :refine="refine"
      :refineEnd="refineEnd ?? false"
    />
    <Lock
      v-if="locked"
      lock
    />
  </BasicCard>
</template>
