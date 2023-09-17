<script setup lang="ts">
import { ClassNameFactor, EventDispatch, merge } from '@/utils';
import { useMockScrollDrag } from '@/utils/hooks';

import { computed, onMounted, reactive, ref, toRaw, toRefs, watch } from 'vue';

interface SelectProps {
  /**
   * options 列表参数
   */
  options: SelectOptionProps[];
  /**
   * 将控制权移交外部
   */
  modelValue?: string | SelectOptionProps;
  maxHeight?: number;
  default?: string;
  direction?: 'down';
}

interface SelectOptionProps {
  text: string;
  value: string;
}

const S = ClassNameFactor('select');

const props = defineProps<SelectProps>();
const emits = defineEmits<{
  (event: 'update:modelValue', aft: string): void;
  (
    event: 'change',
    value: {
      prv: SelectOptionProps;
      aft: SelectOptionProps;
    }
  ): boolean | undefined;
}>();

const { options } = toRefs(props);

const visible = ref(false);
const select = reactive({ text: '', value: '' });
const move = ref(false);
const liRef = ref();

const handleInnerShow = () => {
  visible.value = !visible.value;
  document.addEventListener('click', handleOutSideClose);
};

const handleOutSideClose = () => {
  if (!move.value) {
    visible.value = false;
    document.removeEventListener('click', handleOutSideClose);
  }
  move.value = false;
};

const handleUpdate = (aft: SelectOptionProps) => {
  const prv = toRaw(select);

  if (prv.value === aft.value) return;

  // 除了显示返回 false 都不阻止
  if (emits('change', { prv, aft }) !== false) {
    if (props.modelValue !== undefined) {
      emits('update:modelValue', aft.value);
    }
    merge(select, aft);
  }
};

// 处理点击选项事件
const handleOptionClick = (e: Event) => {
  if (move.value) {
    move.value = false;
    return;
  }
  EventDispatch(e, {
    'select-option-item': (dataset) => {
      const aft = options.value.find((i) => i.value === dataset.value) || _default.value;

      handleUpdate(aft);

      visible.value = false;
      document.removeEventListener('click', handleOutSideClose);
    }
  });
};

const _default = computed(
  () => options.value.find((i) => i.value === props.default) || options.value[0]
);

/**
 * 初始化选项
 * 1. 外部传值且未赋值，或初始值不在列表内
 *    有默认值则赋值默认值
 *    无默认值则赋值列表第一项
 * 2. 外部未传值
 *    有默认值则赋值默认值
 *    无默认值则赋值列表第一项
 */
onMounted(() => {
  if (options.value.length === 0) return;

  let _select;

  // 决定_select更新值
  if (props.modelValue !== undefined) {
    _select =
      options.value.find((i) => i.value === (props.modelValue || props.default)) || _default.value;
  } else if (props.default !== undefined) {
    _select = options.value.find((i) => i.value === props.default) || options.value[0];
  } else {
    _select = options.value[0];
  }

  // update
  handleUpdate(_select);
});

watch(
  () => props.modelValue,
  () => {
    // 外部状态存在且发生变化， 更新内部状态
    if (props.modelValue && props.modelValue !== select.value) {
      const _select = props.options.find((i) => i.value === props.modelValue) || _default.value;
      handleUpdate(_select);
    }
  }
);

useMockScrollDrag(liRef, {
  mouseMove(e, state) {
    if (state !== 'up') move.value = true;
  }
  // mouseUp() {
  //   setTimeout(() => {
  //     move.value = false;
  //   }, 10);
  // }
});
</script>

<template>
  <div
    :class="S()"
    :draggable="false"
  >
    <!-- 用于展示的按钮 -->
    <div
      :class="S('-show')"
      @click.stop="handleInnerShow"
    >
      <div>{{ select.text }}</div>
    </div>

    <ul
      ref="liRef"
      :class="
        S({
          '-option-list': true,
          '-option-direction': props?.direction === 'down',
          '-option-list-hidden': !visible
        })
      "
      :style="props.maxHeight ? { 'max-height': `${props.maxHeight}px` } : undefined"
      data-type="option-list"
      @click.stop="handleOptionClick"
    >
      <li
        v-for="(i, index) in props.options"
        :class="
          S({
            '-option-item': true,
            '-option-item-select': select.value === i.value
          })
        "
        data-type="select-option-item"
        :data-value="i.value"
        :key="index"
        :draggable="false"
      >
        {{ i.text }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.select {
  position: relative;
  &-show {
    position: relative;

    height: 50px;
    // width: 250px;
    border-radius: 25px;
    padding: 0 25px;

    font-size: 18px;
    color: @fontdarkgray;
    line-height: 50px;

    background: @blank-white;
    user-select: none;

    &::after {
      content: '';
      position: absolute;
      right: 25px;
      top: 50%;

      transform: translate(50%, -50%);

      border: 8px solid transparent;
      border-top: 10px solid @fontdarkgray;
      border-bottom: 0px;
    }
    &:active {
      height: 45px;
      margin: 2.5px 0;
      background-color: rgb(156, 151, 143);
      line-height: 45px;
      color: @blank-white;
      &::after {
        border-top-color: @blank-white;
      }
    }
  }

  &-option {
    &-list {
      position: absolute;
      width: 100%;
      margin: 0;
      padding: 0px;

      border-radius: 25px;

      transform: translateY(-100%);
      top: 0;

      overflow-y: scroll;
      background-color: @fontdarkgray;
      transition: 0.3s;
      &::-webkit-scrollbar {
        display: none;
      }

      &-hidden {
        height: 0;
        opacity: 0;
      }
    }
    &-list&-direction {
      transform: translateY(0);
      // bottom: 0;
      top: auto;
    }
    &-item {
      position: relative;
      // width: 100%;
      border-radius: 25px;
      height: 50px;
      margin: 5px;
      line-height: 50px;
      padding: 0 25px;
      font-size: 18px;
      color: @blank-white;
      user-select: none;
      text-decoration: none;
      list-style: none;

      &:hover {
        background: rgba(255, 255, 255, 0.101);
      }

      &:active {
        color: @fontdarkgray;
        background: @blank-white;
      }

      &-select {
        background: rgba(255, 255, 255, 0.101);
        &::after {
          content: '';
          position: absolute;
          top: 40%;
          right: 30px;

          display: block;
          width: 10px;
          height: 20px;
          border-bottom-right-radius: 4px;

          transform: rotate(50deg) translate(0, -70%);

          border: 4px solid @blank-white;
          border-top: none;
          border-left: none;
        }

        &:active::after {
          border: 4px solid @fontdarkgray;
          border-top: none;
          border-left: none;
        }
      }
    }
  }
}
</style>
