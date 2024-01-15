<script setup lang="tsx">
import { Icon } from '@shi-zhong/genshin-ui';
import Close from '@/assets/icons/close.png';
import { ref } from 'vue';
import Sound from '@/assets/sound';


const props = withDefaults(defineProps<{ autoClose?: boolean; visible: boolean }>(), {
  autoClose: false
});
const emits = defineEmits<{ (e: 'close'): void }>();

const root = document.body;
const moveCancel = ref(false);

const handleClose = () => {
  if (moveCancel.value) {
    moveCancel.value = false;
    return;
  }
  emits('close');
};
</script>

<template>
  <Teleport :to="root">
    <Transition name="dm-transition-animate">
      <div
        v-if="props.visible"
        class="dm-container"
        @click="props.autoClose && handleClose()"
        @mousedown="() => (moveCancel = false)"
        @mousemove="() => (moveCancel = true)"
      >
        <div class="dm-close">
          <Icon
            type="projection"
            :src="Close"
            color="white"
            :size="40"
            @click="
              () => {
                emits('close');
                Sound.DDing.once();
              }
            "
          />
        </div>
        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="less">
// dm: drop-mask
.dm-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;

  user-select: none;
}

.dm-close {
  position: absolute;
  right: 0;
  margin: 20px;
}

.dm-transition-animate-enter-active {
  animation: DmIn 0.3s;
}
.dm-transition-animate-leave-active {
  animation: Dmout 0.3s forwards;
}

@keyframes DmIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes Dmout {
  from {
    opacity: 1;
    transform: t scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.98);
  }
}
</style>
