<script setup lang="ts">
import { Lock } from '@/components/Tags';
import { type BasicCardProps } from '@/components/Cards/interface';
import { BasicCard } from '@/components/Cards';
import { useConfig } from '@/stores/config';

interface WeaponCardProps extends BasicCardProps {
  locked: boolean;
  imgUrl: string;
}

const props = defineProps<WeaponCardProps>();
const config = useConfig()
</script>

<template>
  <BasicCard
    type="weapon"
    v-bind="props"
    :imgUrl="config.weaponImage(props.imgUrl)"
  >
    <Lock
      v-if="locked"
      lock
    />
  </BasicCard>
</template>

<style scoped lang="less"></style>
