<script setup lang="ts">
import { Lock } from '@/components/Tags';
import { type BasicCardProps } from '@/components/Cards/interface';
import { BasicCard } from '@/components/Cards';

interface WeaponCardProps extends BasicCardProps {
  locked: boolean;
}

const props = defineProps<WeaponCardProps>();

</script>

<template>
  <BasicCard
    type="weapon"
    v-bind="props"
  >
    <Lock
      v-if="props.locked"
      lock
    />
  </BasicCard>
</template>

<style scoped lang="less"></style>
