<script setup lang="ts">
import { toRefs, ref } from 'vue';
import { ClassNameFactor } from '@/utils/className';
import Icon from './Icon.vue';
import { type ButtonProps, type ButtonEmit } from './interface';
import AttentionDecoration from './AttentionDecoration.vue';

const props = defineProps<ButtonProps>();

const { type, icon, size, disable, attention } = toRefs(props);

const emit = defineEmits<ButtonEmit>();

const S = ClassNameFactor('button-wrap-');

const button = ref('');

switch (type.value) {
  case 'shrink': {
    if (props.shape && props?.shape === 'round') {
      button.value = S(['shrink', 'round']);
    } else {
      button.value = S({
        shrink: true,
        'shrink-disable': Boolean(props.disable)
      });
    }
    break;
  }
  case 'spread': {
    button.value = S('spread');
    break;
  }
}
</script>
<template>
  <button
    :class="[S('button'), button]"
    @click="emit('click')"
    :disabled="disable"
  >
    <!-- 这里可以用span包裹，但是不知道有啥用 -->
    <Icon
      v-if="icon"
      :icon="icon"
      :size="size"
    />
    <AttentionDecoration
      v-if="attention"
      :class="S('attention')"
    />
    <span
      v-if="type === 'shrink' && shape !== 'round'"
      :class="S({ balance: balance === true })"
    >
      <slot></slot>
    </span>
  </button>
</template>

<style scoped lang="less">
.button-wrap {
  &-button {
    position: relative;
    z-index: 4;

    min-width: 60px;

    // height: 100%;
    min-height: 60px;
    max-height: 200px;

    border: none;
    margin: 0;
    padding: 0;

    text-align: center;
    background: none;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;

      background: @blank-white;
      box-shadow: @box-shadow;
      transition: 0.1s;
    }

    &::after {
      position: absolute;
      z-index: 1;

      top: 0;
      left: 0;

      background: @blank-white;
      box-shadow: @box-shadow;
      transition: 0.1s;
    }
  }

  &-special {
    position: absolute;
    top: 0;
    height: 60%;
    z-index: 3;
    transform: translate(33.3%, 33.3%);
  }

  &-attention {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 3;
    height: 30%;
  }

  &-image {
    position: relative;
    z-index: 3;
    height: 30px;
    margin: 15px;
    vertical-align: middle;
    transition: 0.1s;
    user-select: none;
  }
}

.button-wrap {
  &-spread {
    aspect-ratio: 1;
  }

  &-spread::after {
    content: '';
    // 64px
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;

    background: rgb(156, 151, 143);
    box-sizing: border-box;
  }

  &-spread::before {
    content: '';
    height: 80%;
    aspect-ratio: 1;
    border-radius: 50%;

    margin: 10%;
  }

  &-spread &-image {
    margin: 17px;
  }

  &-spread:active &-special {
    opacity: 0.8;
  }

  &-spread:active::before {
    height: 95%;
    margin: 2.5%;
    background-color: rgb(169, 168, 165);
    box-shadow: @shadow;
  }

  &-spread:active &-image {
    filter: brightness(5);
  }
}

.button-wrap {
  &-shrink {
    width: 100%;
    z-index: 5;
    font-size: 23px;
    min-width: 50px;
    min-height: 50px;
    color: @fontdarkgray;

    &::before {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  }

  &-balance {
    padding-left: 25px;
  }

  &-shrink&-round {
    aspect-ratio: 1;
    width: auto;
  }

  &-shrink:active {
    color: @blank-white;
  }

  &-shrink::after {
    content: '';
    z-index: -1;
    border-radius: 999px;
    width: 100%;
    height: 100%;
  }

  &-shrink &-image {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0;
    transform: translate(-50%, -50%);
  }

  &-shrink:active::after {
    transform: scale(0.995);
    opacity: 0.5;
    box-shadow: @shadow;
  }

  &-shrink:active &-image {
    filter: brightness(5);
  }

  &-shrink:active &-special {
    opacity: 0.8;
  }

  &-shrink-disable {
    &::after {
      background-color: transparent;
      border: 1px solid @blank-white;
    }

    &:active::after {
      transform: none;
      opacity: 1;
    }

    color: @blank-white;
    opacity: 0.5;
  }

  // 重写 active 激活样式
  &-shrink-disable:active &-special-round {
    opacity: 1;
  }

  &-shrink-disable:active &-special-fork {
    opacity: 1;
  }
}
</style>
