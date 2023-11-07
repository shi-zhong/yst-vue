<script setup lang="ts">
import BasicCard from './Card.vue';

import type { CharacterCardProps } from './interface';
import { GetElementPicture, ClassNameFactor } from '@/utils';

import { useConfig } from '@/stores/config';

const S = ClassNameFactor('character-');

defineProps<CharacterCardProps>();

const config = useConfig();
</script>

<template>
  <BasicCard
    :class="
      S({
        'in-team': inTeam === true,
        'not-in-team': inTeam !== true
      })
    "
    type="character"
    :imgUrl="config.CharacterImage(`${eName}/avatar.png`)"
    :foucsing="foucsing"
    :star="star"
    :desc="lvl ? `Lv.${lvl}` : name ?? '角色名'"
  >
    <img
      :class="S('element')"
      draggable="false"
      :src="GetElementPicture(element)"
      alt="element"
    />
  </BasicCard>
</template>

<style scoped lang="less">
.character {
  &-element {
    width: 30px;
    margin: 3px;
  }
  &-in-team {
    border-top: 4px solid @selected-border;
    border-bottom: 4px solid @selected-border;
  }
  &-not-in-team {
    margin-top: 9px;
    margin-bottom: 9px;
  }
}
</style>
