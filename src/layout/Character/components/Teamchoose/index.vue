<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';
import { storeToRefs } from 'pinia';

import type { Menu } from '../../interface';

import Folding from './folding.vue';
import Expand from './expand.vue';
import Filter from './filter.vue';
import FilterLine from './filterLine.vue';

const store = useCharacterLayoutStore();
const { select, list, team, clist } = storeToRefs(store);

defineProps<{
  menu: Menu[];
  canExpand?: boolean
}>();

onMounted(() => {
  // 用于第一次初始化，排除可能的隐患
  store.setSelect(select.value);
});

// filter
const elementFilter = ref<string[]>([]);
const weaponFilter = ref<string[]>([]);

const tempElementFilter = ref<string[]>([]);
const tempWeaponFilter = ref<string[]>([]);

// list preOperation
const preList = computed(() =>
  list.value.map((l) => {
    const staD = clist.value.find((s) => s.id === l.character_id);

    if (!staD) return {} as any;

    return {
      ...l,
      star: staD.basic.star,
      name: staD.basic.name,
      eName: staD.basic.eName,
      element: staD.basic.element
    };
  })
);

// team 保证顺序
const inTeam = computed(() => team.value.map(id => preList.value.find((p) => p.id === id)).filter(j => j));
const otTeam = computed(() => preList.value.filter((i) => !team.value.includes(i.id)));

const active = computed(() => {
  return inTeam.value.concat(otTeam.value).findIndex((i) => i.id === select.value)
});

const current = computed(() => {
  const c = preList.value.find((l) => l.id === select.value) as any;

  return {
    element: c?.element || '风',
    name: c?.name || '荧'
  };
});

const updateFilter = (
  tag: 'confirm' | 'rollback' | 'update',
  element: string[],
  weapon: string[]
) => {
  switch (tag) {
    case 'confirm': {
      elementFilter.value = [...tempElementFilter.value];
      weaponFilter.value = [...tempWeaponFilter.value];
      store.popSidebar();
      break;
    }
    case 'rollback': {
      tempElementFilter.value = [...elementFilter.value];
      tempWeaponFilter.value = [...weaponFilter.value];
      store.popSidebar();
      break;
    }
    case 'update': {
      tempElementFilter.value = element;
      tempWeaponFilter.value = weapon;
      break;
    }
  }
};
</script>

<template>
  <div>
    <Transition name="switchL">
      <Folding
        v-if="store.sidebar === ''"
        :menu="menu"
        :current="current"
        :active="active"
        :team="inTeam"
        :list="otTeam"
        :canExpand="canExpand"
        @toExpand="() => {store.pushSidebar('expand'); store.setRight('attr')}"
      />
    </Transition>
    <Transition name="switchL">
      <Expand
        v-if="store.sidebar === 'expand'"
        :team="inTeam"
        :list="otTeam"
        :selected="store.select"
        @toFilter="() => store.pushSidebar('filter')"
      />
    </Transition>
    <Transition name="switchL">
      <Filter
        v-if="store.sidebar === 'filter'"
        :tempElementFilter="tempElementFilter"
        :tempWeaponFilter="tempWeaponFilter"
        @update="updateFilter"
      />
    </Transition>
    <Transition name="switchD">
      <FilterLine
        v-if="
          (store.sidebar === 'filter' || store.sidebar === 'expand') &&
          (tempElementFilter.length || tempWeaponFilter.length)
        "
        :elementSelect="tempElementFilter"
        :weaponSelect="tempWeaponFilter"
        @reset="() => updateFilter('update', [], [])"
      />
    </Transition>
  </div>
</template>

<style scoped lang="less">
@import '@@@/transition.less';
</style>
