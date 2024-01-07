<script setup lang="tsx">
import { Icon } from '@shi-zhong/genshin-ui';
import { EventDispatch } from '@/utils';
import { ref } from 'vue';

interface MenuItem {
  icon: string;
  key: string;
  title: string;
  children?: MenuItem[];
}

const props = defineProps<{
  data: MenuItem[];
  defaultSelect: string;
}>();

const emits = defineEmits<{
  (e: 'click', select: string): void;
  (e: 'change', select: string): void;
}>();

const select = ref(props.defaultSelect ?? props.data[0].key ?? '');

const handleClick = (e: Event) => {
  emits('click', select.value);

  EventDispatch(e, {
    'menu-item': (dataset) => {
      if (dataset.key !== select.value) {
        select.value = dataset.key;
        emits('change', select.value);
      }
    }
  });
};
</script>

<template>
  <div
    class="menu-box"
    data-type="menu"
    @click="(e) => handleClick(e)"
  >
    <div
      v-for="menu of props.data"
      data-type="menu-item"
      :data-key="menu.key"
      :key="menu.key"
      class="but"
      :class="select === menu.key ? 'but-select' : 'but-block'"
    >
      <Icon
        :src="menu.icon"
        :size="50"
        type="projection"
        :color="select === menu.key ? 'rgb(72, 85, 103)' : undefined"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.menu {
  &-box {
    height: 100%;
    box-shadow: 0 0 5px @fontdarkgray;
  }
}

.but {
  border: 2px solid white;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 70px;
  margin: 30px auto;
  border-radius: 10px;
  aspect-ratio: 1;

  &-block {
    background-color: @fontdarkgray;

    &:hover {
      opacity: 0.8;
    }
  }

  &-select {
    background-color: white;
  }
}
</style>
