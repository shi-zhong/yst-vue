<script setup lang="ts">
import { useGlobal } from '@/stores/global';
import Loading from '@@/Loading/index.vue';

const global = useGlobal();
</script>

<template>
  <router-view></router-view>
  <div
    class="loading-page"
    v-if="global.loading !== -1"
  >
    <Loading :progress="80" />
  </div>
</template>

<style scoped lang="less">
.loading-page {
  width: 100vw;
  height: 100vh;
  background: white;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  top: 0;
}
</style>
