<script setup lang="ts">
import { ClassNameFactor } from '@/utils';
import Lock from '@/assets/icons/lock.png';
import { ImageSrc } from '@/components';
import { useConfig } from '@/stores/config';

interface ConstellationIconProps {
  lock: boolean;
  eName: string;
  element: string;
  life: number;
}

const S = ClassNameFactor('constellation-');
const config = useConfig();

defineProps<ConstellationIconProps>();

const elementMap: Record<string, string> = {
  火: 'fire',
  水: 'water',
  雷: 'elec',
  冰: 'ice',
  草: 'grass',
  岩: 'stone',
  风: 'wind'
};
</script>

<template>
  <div
    :class="S(['icon ', elementMap[element] || 'fire'])"
    data-type="active"
    :data-index="life || 0"
  >
    <img
      :draggable="false"
      :class="S('life')"
      :src="life === 0 ? '' : ImageSrc(`${config.character.baseUrl}/${eName}/live${life}.png`)"
      alt=""
    />
    <div
      v-if="lock"
      :class="S('lock')"
    >
      <img
        :draggable="false"
        :src="Lock"
        alt=""
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.constellation {
  &-icon {
    position: relative;

    display: inline-block;
    height: 100%;
    aspect-ratio: 1;

    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    border: 3px solid transparent;
    box-sizing: border-box;

    vertical-align: middle;
    overflow: hidden;
  }

  &-lock {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;

    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    & :first-child {
      display: block;
      width: 70%;
      margin: 15%;
    }
  }

  &-life {
    display: block;
    height: 100%;

    border-radius: 50%;
  }

  &-locked &-life {
    border-color: transparent;
  }

  &-fire {
    border-color: rgb(238, 121, 80);
  }

  &-locked&-fire {
    border-color: rgb(95, 34, 25);
  }

  &-water {
    border-color: rgb(25, 201, 235);
  }

  &-locked&-water {
    border-color: rgb(18, 75, 125);
  }

  &-elec {
    border-color: rgb(230, 155, 248);
  }

  &-locked&-elec {
    border-color: rgb(80, 44, 121);
  }

  &-ice {
    border-color: rgb(168, 243, 247);
  }

  &-locked&-ice {
    border-color: rgb(52, 103, 121);
  }

  &-grass {
    border-color: rgb(188, 241, 26);
  }

  &-locked > &-grass {
    border-color: rgb(62, 93, 29);
  }

  &-wind {
    border-color: rgb(78, 246, 219);
  }

  &-locked&-wind {
    border-color: rgb(28, 90, 75);
  }

  &-stone {
    border-color: rgb(254, 247, 64);
  }

  &-locked&-stone {
    border-color: rgb(109, 75, 22);
  }
}
</style>
