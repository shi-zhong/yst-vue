<script setup lang="ts">
import { Button } from '@/components';
import { ClassNameFactor } from '@/utils';
import CloseSVG from '@/assets/icons/close.png';

/**
 * 支持按钮配置 文字 图标 事件 禁用
 * @param props
 * @returns
 */

interface ModalProps {
  theme?: 'dark' | 'light';
  mask?: boolean;
  index?: number;
  title?: string;
  position?: { [key in 'top' | 'left' | 'right' | 'bottom']: number };
  ok?: {
    text?: string;
    icon?: string;
    disable?: boolean;
  };
  cancel?: {
    text?: string;
    icon?: string;
    disable?: boolean;
  };
}

withDefaults(defineProps<ModalProps>(), {
  theme: 'dark'
});
const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'cancel'): void;
  (e: 'ok'): void;
}>();

const S = ClassNameFactor('modal-');
</script>

<template>
  <div
    :class="S(['body', 'theme-' + theme])"
    :style="{ zIndex: index || 0 }"
    @click.stop="() => {}"
  >
    <div :class="S('title')">
      {{ title || '标题' }}
      <button
        v-if="theme === 'dark'"
        :class="S('close')"
        @click="() => emits('close')"
      >
        <img :src="CloseSVG" />
      </button>
    </div>
    <div :class="S('content')"><slot></slot></div>
    <div
      v-if="ok || cancel"
      :class="S('foot')"
    >
      <div
        v-if="cancel"
        :class="S('foot-item')"
      >
        <Button
          type="shrink"
          :theme="theme === 'dark' ? 'light' : 'dark'"
          :icon="cancel.icon || 'fork'"
          balance
          :disable="cancel.disable"
          @click="() => emits('cancel')"
          >{{ cancel.text || 'Cancel' }}</Button
        >
      </div>
      <div
        v-if="ok"
        :class="S('foot-item')"
      >
        <Button
          type="shrink"
          :theme="theme === 'dark' ? 'light' : 'dark'"
          :icon="ok.icon || 'round'"
          balance
          :disable="ok.disable"
          @click="() => emits('ok')"
          >{{ ok.text || 'Confirm' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '@@/HighLight/index.less';

.modal {
  &-mask-body {
    position: relative;

    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  &-theme {
    &-dark {
      &.modal-body {
        &::before {
          background-color: @fontdarkgray;
        }
        &::after {
          border: 3px solid @fontlightgray;
        }
      }
      & > .modal {
        &-title {
          color: @highlight-spe;
          border-color: @fontlightgray;
        }
        &-foot {
          border-color: @fontlightgray;
        }
      }
    }
    &-light {
      @lightline: rgb(220, 213, 206);
      &.modal-body {
        &::before {
          background-color: rgb(229, 226, 221);
        }
        &::after {
          border: 3px solid @lightline;
        }
      }
      & > .modal {
        &-title {
          color: @fontdarkgray;
          border-color: @lightline;
        }
        &-foot {
          border-color: @lightline;
        }
      }
    }
  }

  &-body {
    // 居中
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    min-width: 650px;
    min-height: 500px;

    pointer-events: all;

    @gap: 10px;

    // 伪元素构建背景板和边框，减少DOM
    &::before {
      // 模拟背景板
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      padding: @gap;
      box-sizing: content-box;

      position: absolute;
      top: -@gap;
      left: -@gap;
      z-index: -1;

      border-radius: 15px;
    }
    &::after {
      // 模拟边框
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;

      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;

      border-radius: 15px;
    }
  }
  &-title {
    position: relative;

    text-align: center;
    font-size: 30px;
    margin: 0 30px;

    user-select: none;

    height: 66px;
    line-height: 66px;
    border-bottom: 2px solid @fontlightgray;
  }
  &-close {
    background-color: transparent;
    border: none;

    position: absolute;
    top: 17px;
    right: 0px;

    width: 32px;
    height: 32px;
    padding: 0;
    overflow: hidden;
    &:active {
      opacity: 0.5;
    }
    & > img {
      // 将图片移出可视区域
      width: 100%;
      transform: translateX(100px);
      filter: drop-shadow(@highlight-spe -100px 0) brightness(0.7);
    }
  }

  &-content {
    margin: 0 30px;
    min-height: 350px;
    // maybe cource problem
    // height: 350px;
  }
  &-foot {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 80px;
    margin: 0 30px;
    border-top: 2px solid @fontlightgray;
    &-item {
      width: 45%;
    }
  }
}

.modal-transition-animate-enter-active {
  animation: ModalIn 0.3s;
}
.modal-transition-animate-leave-active {
  animation: ModalOut 0.3s forwards;
}

@keyframes ModalIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes ModalOut {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
}
</style>
