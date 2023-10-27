<script setup lang="ts">
defineProps<{ dire: 'L' | 'R' }>();
</script>

<template>
  <Transition :name="`switch${dire}`">
    <KeepAlive>
      <slot></slot>
    </KeepAlive>
  </Transition>
</template>

<style scoped lang="less">
.switchL {
  &-enter-from,
  &-leave-to {
    transform: translateX(-500px);
  }

  &-enter-active {
    transition: all 0.3s ease-in-out;
    z-index: 2;
  }

  &-leave-active {
    transition: all 0.3s ease-in-out;
    z-index: 1;
  }
}


</style>
