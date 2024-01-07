<script setup lang="ts">
import { Card as BasicCard, Lock} from '@shi-zhong/genshin-ui'

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
