<script setup lang="ts">
import ArrowImage from '@/assets/icons/arrow.png';
import Icon from '../commons/Icon/index.vue';
import { ref, watchEffect } from 'vue';

const props = defineProps<{
  min?: number;
  max?: number;
  modelValue?: number;
  size?: number;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', v: number): void;
}>();

const value = ref(props.modelValue ?? 0);

const handleValue = (direct: boolean) => {
  if (direct) {
    if (props.max === undefined || props.max >= value.value + 1) {
      emits('update:modelValue', value.value + 1);
      value.value++;
    }
  } else {
    if (props.min === undefined || props.min <= value.value - 1) {
      emits('update:modelValue', value.value - 1);
      value.value--;
    }
  }
};

watchEffect(() => (value.value = props.modelValue ?? 0));
</script>

<template>
  <div class="arrow-count">
    <Icon
      type="projection"
      :src="ArrowImage"
      color="rgb(116, 119, 128)"
      :size="size"
      :style="{ height: `${size ?? 20}px` }"
      @click="() => handleValue(false)"
    />
    <slot :value="value"></slot>
    <Icon
      type="projection"
      :src="ArrowImage"
      color="rgb(116, 119, 128)"
      :size="size"
      style="transform: rotate(180deg)"
      :style="{ height: `${size ?? 20}px` }"
      @click="() => handleValue(true)"
    />
  </div>
</template>

<style scoped lang="less">
.arrow-count {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
