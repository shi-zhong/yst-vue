<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import { AppendSlot } from '@/utils/vNode/appendSlot';
import { Between } from '@/utils/math';
import { useThrettleFn } from '@/utils/hooks';

const props = withDefaults(
  defineProps<{
    placement: 'top' | 'bottom' | 'left' | 'right';
    content?: JSX.Element;
  }>(),
  {
    placement: 'top'
  }
);

const popover = ref(null);

const init = ref(false);

const visible = ref(false);

const timeout = ref(setTimeout(() => {}, 100));

const pos = reactive({
  dire: 'top',
  left: 800,
  top: 50,
  width: 0,
  height: 0
});

const mouseEnter = async (e: MouseEvent) => {
  init.value = true;
  visible.value = true;
  clearTimeout(timeout.value);

  if ((e.target as HTMLElement)!.dataset.role === 'popover') return;

  // 使用 nextTick 保证元素获取渲染后的正确大小
  await nextTick();

  requestPopoverPosition(e);
};

const requestPopoverPosition = useThrettleFn(async (e: MouseEvent) => {
  // 计算元素位置
  const {
    width: cWidth,
    height: cHeight,
    top: cTop,
    left: cLeft,
    right: cRight,
    bottom: cBottom
  } = (e.target as HTMLElement)?.getBoundingClientRect() || {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  };
  const { width: pWidth, height: pHeight } = (
    popover.value as unknown as HTMLElement
  )?.getBoundingClientRect() || {
    width: 0,
    height: 0
  };

  const { innerWidth, innerHeight } = window;

  const { x, y } = e;

  // 更新盒子信息
  pos.width = pWidth;
  pos.height = pHeight;

  if (props.placement === 'top' || props.placement === 'bottom') {
    const needSpace = pHeight + 10;
    const freeTop = cTop > needSpace;
    const freeBottom = innerHeight - cBottom > needSpace;

    // 在上方且空间够， 在上方上方空间不够，下方空间不够，在下方下方空间不够上方
    if (
      (props.placement === 'top' && (freeTop || (!freeTop && !freeBottom))) ||
      (props.placement === 'bottom' && !freeBottom && freeTop)
    ) {
      // top
      pos.dire = 'top';
      pos.top = cTop - pHeight - 10;
    } else {
      // bottom
      pos.dire = 'bottom';
      pos.top = cBottom + 10;
    }

    if (cWidth > 3 * pWidth) {
      pos.left = Between(Between(x - pWidth / 2, cLeft, cRight - pWidth), 0, innerWidth - pWidth);
    } else {
      pos.left = Between(
        Between(cLeft + cWidth / 2 - pWidth / 2, cLeft, cRight - pWidth),
        0,
        innerWidth - pWidth
      );
    }
  } else {
    const needSpace = pWidth + 10;
    const freeLeft = cLeft > needSpace;
    const freeRight = innerWidth - cRight > needSpace;

    // 在左边且空间够， 在左边左边空间不够，右边空间不够，在右边右边空间不够，在右边左边空间不够
    if (
      (props.placement === 'left' && (freeLeft || (!freeLeft && !freeRight))) ||
      (props.placement === 'right' && !freeRight && freeLeft)
    ) {
      // left
      pos.dire = 'left';
      pos.left = cLeft - pWidth - 10;
    } else {
      //right
      pos.dire = 'right';
      pos.left = cRight + 10;
    }
    if (cHeight > 3 * pHeight) {
      pos.top = Between(
        Between(y - pHeight / 2, cTop, cBottom - pHeight),
        0,
        innerHeight - pHeight
      );
    } else {
      pos.top = Between(
        Between(cTop + cHeight / 2 - pHeight / 2, cTop, cBottom - pHeight),
        0,
        innerHeight - pHeight
      );
    }
  }
}, 30);

// 关闭悬浮窗口
const mouseLeave = () => {
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    visible.value = false;
  }, 100);
};
</script>

<template>
  <AppendSlot
    @mouseleave="mouseLeave"
    @mouseenter="mouseEnter"
    @mousemove="requestPopoverPosition"
    :default="$slots.default"
  />
  <Teleport to="body">
    <div
      v-if="init && content"
      v-show="visible"
      class="popover"
      role="popover"
      data-role="popover"
      ref="popover"
      @mouseleave="mouseLeave"
      @mouseenter="mouseEnter"
      :style="{
        left: `${pos.left}px`,
        top: `${pos.top}px`
      }"
    >
      <div
        :class="`popover-arrow popover-arrow-${pos.dire}`"
        @mouseover.stop="() => {}"
      ></div>
      <component :is="content" />
    </div>
  </Teleport>
</template>

<style scoped lang="less">
.popover {
  position: absolute;
  display: inline-block;
  padding: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  background-color: #fff;
  border-radius: 5px;

  &-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-top-color: #fff;

    &-top {
      transform: translateX(-50%);
      left: 50%;
      bottom: -10px;
    }
    &-bottom {
      transform: translateX(-50%) rotate(180deg);
      left: 50%;
      top: -10px;
    }
    &-left {
      transform: translateY(-50%) rotate(-90deg);
      top: 50%;
      right: -10px;
    }
    &-right {
      transform: translateY(-50%) rotate(90deg);
      top: 50%;
      left: -10px;
    }
  }
}
</style>
