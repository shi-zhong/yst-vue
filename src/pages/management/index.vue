<script setup lang="ts">
import Drawer from './components/drawer.vue';

import CharacterImage from '@/assets/icons/characters.webp';
import ArtifactImage from '@/assets/icons/artifact.png';
import WeaponImage from '@/assets/icons/weapon.png';
import { useRoute } from 'vue-router';

const data = [
  {
    key: 'character',
    icon: CharacterImage,
    title: '角色'
  },
  {
    key: 'artifact',
    icon: ArtifactImage,
    title: '圣遗物'
  },
  {
    key: 'weapon',
    icon: WeaponImage,
    title: '武器'
  }
];

const router = useRoute();
</script>

<template>
  <Drawer
    class="sidebar"
    :data="data"
    :defaultSelect="router.path.split('/')[2]"
    @change="
      (path) => {
        $router.push(`/manage/${path}`);
      }
    "
  />
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<style scoped lang="less">
.sidebar {
  position: absolute;
  height: 100vh;
  width: 100px;
  background-color: @blank-white;
}
.content {
  margin-left: 100px;
  height: 100vh;
}
</style>
