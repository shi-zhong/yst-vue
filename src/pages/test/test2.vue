<script setup lang="ts">
import TFS from '@/components/commons/ScrollView/TransformScroll.vue';
</script>

<template>
  <TFS
    class="test"
    slide
    :border="{ top: 100 }"
  >
    <div v-for="i in Array(80)">hello</div>
  </TFS>
</template>

<style scoped lang="less">
.root {
  height: 500px;
}

.test {
  width: 500px;
  height: 800px;
}
</style>
