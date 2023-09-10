<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue';
import { stack } from './index';
import ModalView from './Modalview.vue';

interface ModalButtonConfig {
  text?: string;
  icon?: string;
  disable?: boolean;
}

// 需要消费的属性
export interface ModalProps {
  visible: number;
  theme?: 'dark' | 'light';
  mask?: boolean;

  title?: string;
  position?: { [key in 'top' | 'left' | 'right' | 'bottom']: number };

  okText?: string;
  okIcon?: string;
  okDisable?: boolean;

  cancelText?: string;
  cancelIcon?: string;
  cancelDisable?: boolean;

  // 总配置 单个配置优先
  ok?: ModalButtonConfig;
  cancel?: ModalButtonConfig;
}

const props = defineProps<ModalProps>();

const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'cancel'): void;
  (e: 'ok'): void;
}>();

const instance = Symbol('modal');

const index = ref(0);

watch(
  () => props.visible,
  (aft, pve) => {
    // 打开置顶
    if (aft > 0 && pve > 0) {
      stack.jumpTop(instance);
      if (stack.top.value) {
        index.value = stack.top.value.index;
      }
      // 打开
    } else if (aft > 0 && pve <= 0) {
      stack.push({ symbol: instance, index: 0 });
      if (stack.top.value) {
        index.value = stack.top.value.index;
      }
    } else {
      stack.cancelMiddle(instance);
    }
  }
);

onUnmounted(() => {
  stack.cancelMiddle(instance);
});

const okButtonProps = {
  text: props.okText,
  icon: props.okIcon,
  disable: props.okDisable,
  ...props.ok
};

const okNotEmpty = computed(
  () => props.okText !== undefined || props.okIcon !== undefined || props.ok !== undefined
);

const cancelButtonProps = {
  text: props.cancelText,
  icon: props.cancelIcon,
  disable: props.cancelDisable,
  ...props.cancel
};

const cancelNotEmpty = computed(
  () =>
    props.cancelText !== undefined || props.cancelIcon !== undefined || props.cancel !== undefined
);

const mergeVisible = computed(() => {
  return (stack.top.value === null || stack.top.value.symbol === instance) && props.visible > 0;
});

const container = document.body;
</script>

<template>
  <Teleport :to="container">
    <div
      v-if="mergeVisible"
      class="modal-mask"
      :style="{ display: !mask || !visible ? 'none' : 'block' }"
      @click="() => emits('close')"
    ></div>
    <Transition name="modal-transition-animate">
      <ModalView
        v-if="visible"
        :theme="theme"
        :mask="mask"
        :index="index"
        :title="title"
        :position="position"
        :ok="okNotEmpty ? okButtonProps : undefined"
        :cancel="cancelNotEmpty ? cancelButtonProps : undefined"
        @close="() => emits('close')"
        @ok="() => emits('ok')"
        @cancel="() => emits('cancel')"
      >
        <slot></slot>
      </ModalView>
    </Transition>
  </Teleport>
</template>

<style scoped lang="less">
.modal-mask {
  position: absolute;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: all;
}
</style>
