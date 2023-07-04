<script setup lang="ts">
import LockedImage from './assets/lock.png';
import UnLockedImage from './assets/unlock.png';

interface LockProps {
  lock?: boolean;
  border?: boolean;
  size?: 'small' | 'middle' | 'large' | number;
}

const props = defineProps<LockProps>();
</script>

<template>
  <div :class="['lock-container', props.lock ? 'locked' : 'unlock']">
    <img
      class="lock"
      :src="props.lock ? LockedImage : UnLockedImage"
      :alt="props.lock ? 'locked' : 'unlock'"
      :style="{ width: `${props.size || 15}px` }"
      :draggable="false"
    />
  </div>
</template>

<style scoped lang="less">
@unlock-white: rgb(243, 240, 233);

.lock {
  &-container {
    margin: 5px;
    border-radius: 3px;
    display: inline-block;
    box-shadow: @box-shadow;
    line-height: 2px;
  }
  width: 100%;
}

.locked {
  background: @fontdarkgray;
}

.unlock {
  background: @unlock-white;
}
</style>
