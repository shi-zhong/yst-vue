<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, type RouteRecordRaw } from 'vue-router';

const router = useRouter();

const GetLoopRoute = (routes: readonly RouteRecordRaw[], prefix: string): string[] => {
  return routes
    .map((route) => {
      if (route.children) {
        return GetLoopRoute(route.children, route.path);
      } else if (route.redirect === undefined) {
        if (route.path[0] === '/') {
          return route.path;
        } else {
          return `${prefix}/${route.path}`;
        }
      } else {
        return '';
      }
    })
    .flat()
    .filter((path) => path);
};

const routers = computed(() => GetLoopRoute(router.options.routes, ''));
</script>

<template>
  <div :style="{ padding: '30px 60px' }">
    <p
      class="router-link"
      v-for="route in routers"
      :key="route"
    >
      <RouterLink
        :to="route || ''"
        replace
        >{{ route }}</RouterLink
      >
    </p>
  </div>
</template>

<style scoped>
.router-link {
  color: blue;
}
</style>
