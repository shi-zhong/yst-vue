<script setup lang="ts">
import { Lock } from '@/components/Tags';
import { type BasicCardProps } from '@/components/Cards/interface';
import BasicCard from '@/components/Cards/index.vue';
import { useAttrs } from 'vue';

interface ArtifactCardProps {
  locked: boolean;
}

const props = defineProps<ArtifactCardProps>();
const attr = useAttrs() as unknown as BasicCardProps;
</script>

<template>
  <BasicCard
    type="artifact"
    v-bind="attr"
  >
    <Lock
      v-if="props.locked"
      lock
    />
  </BasicCard>
</template>

<style scope lang="less"></style>
