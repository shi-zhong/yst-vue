<script setup lang="ts">
import { Loading, Button } from '@shi-zhong/genshin-ui';

import { DropFile, DropImage } from '@/components';
import { SearchPath } from '@/utils/types';
import { Login } from '@/api';

console.log(SearchPath([1, 2, {a: 'a'}], '2.a'));
</script>

<template>
  <DropFile style="background-color: red; width: 100px; height: 100px; display: inline-block">
    <div></div>
    <template #dropover> dropover </template>
  </DropFile>

  <Button @click="Login" type="spread" icon="menu">Get Token</Button>
  <Button type="spread" icon="menu">Get Token</Button>

  <div style="display: flex; justify-content: center">
    <Loading
      :stage="10"
      :parts="1"
    />
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
