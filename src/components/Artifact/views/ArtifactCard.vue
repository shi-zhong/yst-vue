<script setup lang="ts">
import { Lock } from '@/components/Tags';
import { BasicCard } from '@/components/Cards';

interface ArtifactCardProps {
  locked: boolean;
}

const props = defineProps<ArtifactCardProps>();

</script>

<template>
  <BasicCard
    type="artifact"
    v-bind="props"
  >
    <Lock
      v-if="props.locked"
      lock
    />
  </BasicCard>
</template>

<style scoped lang="less"></style>
