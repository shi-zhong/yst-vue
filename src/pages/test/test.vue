<script setup lang="ts">
import { Loading } from '@shi-zhong/genshin-ui';

import { DropFile, DropImage } from '@/components';
import { Login } from '@/api';

</script>

<template>
  <DropFile style="background-color: red; width: 100px; height: 100px; display: inline-block">
    <div></div>
    <template #dropover> dropover </template>
  </DropFile>

  <button @click="Login">Get Token</button>

  <div style="display: flex; justify-content: center">
    <Loading :stage="10" :parts="1"  />
  </div>

  <div class="ys-nywys">
    <div>原来</div>
    <div>你也玩原神</div>
  </div>
</template>

<style scoped lang="less">
.ys-nywys {
  position: fixed;
  left: 0;
  width: 100vw;
  height: 50vh;
  font-size: 100px;
  text-align: center;
}

.root {
  height: 500px;
}
</style>
