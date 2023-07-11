<script setup lang="ts">
import { useDebounce, useMockScrollDrag, useThrettle } from '@/utils';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import ScrollBar from './Scrollbar.vue';

interface ScrollViewProps {
  direction?: 'x' | 'y' | 'both';
  scrollBehavior?: 'auto' | 'scroll' | 'hidden';

  customScrollbar?: string;
  transformBoxClass?: string;

  border?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };

  dataType?: string;
  slide?: boolean;
  slideOption?: {
    threshold: number;
    distance: (i: number) => number;
  };
}

interface ScrollViewEmits {
  (event: 'click', e: Event): void;
  (
    event: 'touchBorder',
    type: {
      direction: 'left' | 'right' | 'top' | 'bottom';
      mouseState: 'up' | 'down' | 'move';
    },
    ref: any
  ): void;
  (
    event: 'scroll',
    e: Event,
    scrollState: {
      mouseState: 'up' | 'move' | 'down';
      scroll: {
        x: number;
        y: number;
      };
    }
  ): void;
}

const props = withDefaults(defineProps<ScrollViewProps>(), {
  direction: 'y',
  scrollBehavior: 'auto'
});
const emits = defineEmits<ScrollViewEmits>();

const scrollRef = ref<HTMLDivElement>();

/**
 * transform 滚动位置
 * movement 滑动记录
 */
const transform = reactive<{ x: number; y: number }>({ x: 0, y: 0 });
const movement = reactive<{ x: number; y: number }>({ x: 0, y: 0 });
const heights = reactive<{ client: number; scroll: number }>({ client: 1, scroll: 1 });
const position = ref<'left' | 'right' | 'top' | 'bottom' | ''>('');

/**
 *
 * 滚动视图相关函数
 *
 */

// 设置滑动
const doSlide = () => {
  /**
   * @todo 表现优化
   */

  // 自定义滑动阈值
  let x = transform.x,
    y = transform.y;

  if (Math.abs(movement.x) > ((props.slideOption && props.slideOption.threshold) || 1)) {
    x = props.slideOption ? props.slideOption.distance(movement.x) : transform.x - 30 * movement.x;
  }

  if (Math.abs(movement.y) > ((props.slideOption && props.slideOption.threshold) || 1)) {
    y = props.slideOption ? props.slideOption.distance(movement.y) : transform.y - 30 * movement.y;
  }

  ScrollToAnimate({
    ...limitTransformInVisibleView(y, x),
    behavior: 'smooth'
  });

  movement.x = 0;
  movement.y = 0;
};

// 将偏移距离限制在visible区域内
const limitTransformInVisibleView = (top: number, left: number) => {
  const retPos = {
    top: top,
    left: left
  };

  if (!scrollRef.value) return retPos;

  /**
   *
   * ** 公式说明 **
   *
   * 顶部出现空白，有以下公式
   *
   * transform.y < 0; 得 transform.y -> 0;
   *
   * 顶部没有空白，有 transform.y > 0;
   *
   *  此时 当 **内容节点** 高度小于 **容器节点** 有
   *    scrollHeight === clientHeight
   *    transform.y -> 0;
   *
   *  当 **内容节点** 高度大于 **容器节点** 有
   *    scrollHeight === **内容节点** 高度
   *
   *    底部空白出现 有 transform.y + clientHeight > scrollHeight
   *               即 transform.y > scrollHeight - clientHeight
   *
   * 保留状态 有 0 < transform.y < scrollHeight - clientHeight
   *
   */

  const { scrollHeight, clientHeight, scrollWidth, clientWidth } = scrollRef.value;

  if (top < 0 || scrollHeight === clientHeight) {
    retPos.top = 0;
  } else if (top > scrollHeight - clientHeight) {
    retPos.top = scrollHeight - clientHeight;
  }

  if (left < 0 || scrollWidth === clientWidth) {
    retPos.left = 0;
  } else if (left > scrollWidth - clientWidth) {
    retPos.left = scrollWidth - clientWidth;
  }

  return retPos;
};

// 自定义滚动函数，使用 requestAnimationFrame 进行动画
const mergeAnimate = reactive<{
  close: undefined | (() => void);
  x: number;
  y: number;
  muti: 'cancel' | 'merge';
}>({
  close: undefined,
  x: 0,
  y: 0,
  muti: 'cancel'
});

/**
 * @todo 优化滚动函数表现效果 
 */
const ScrollToAnimate = (
  pos: { top: number; left: number; behavior?: 'smooth' },
  muti: 'merge' | 'cancel' = 'cancel'
) => {
  let closeFlag = false;

  const ScrollTo = (pos: { top: number; left: number; behavior?: 'smooth' }) => {
    let transformTopChange = 0;
    let transformLeftChange = 0;

    const base = 20;

    /**
     *      ^
     * base |    ________
     *      |   /|
     *      |  / |
     *      | /  |
     *      |---------------> delta
     *           max
     *    base < Fn < 2 * base
     */

    const speedFn = (delta: number) => {
      const max = 500;
      if (Math.abs(delta) > max) {
        return 2 * base;
      } else {
        return base + Math.abs((base / max / max) * delta * delta);
        // return base + Math.abs((base / max) * delta);
      }
    };

    /**
     * 没有 smooth 直接跳转
     */
    if (pos.behavior !== 'smooth') {
      transform.x = pos.left;
      transform.y = pos.top;
      return;
    }

    let finalTop = mergeAnimate.muti === 'merge' ? mergeAnimate.y : pos.top;
    let finalLeft = mergeAnimate.muti === 'merge' ? mergeAnimate.x : pos.left;

    if (finalTop !== transform.y) {
      transformTopChange =
        (finalTop > transform.y ? 1 : -1) *
        (Math.abs(finalTop - transform.y) < base
          ? Math.abs(finalTop - transform.y)
          : speedFn(finalTop - transform.y));
      transform.y += transformTopChange;
    }

    if (finalLeft !== transform.x) {
      transformLeftChange =
        (finalLeft > transform.x ? 1 : -1) *
        (Math.abs(finalLeft - transform.x) < base
          ? Math.abs(finalLeft - transform.x)
          : speedFn(finalLeft - transform.x));
      transform.x += transformLeftChange;
    }

    if (
      !closeFlag &&
      mouseState.value === 'up' &&
      (transformLeftChange !== 0 || transformTopChange !== 0)
    ) {
      requestAnimationFrame(() =>
        ScrollTo({
          top: finalTop,
          left: finalLeft,
          behavior: pos.behavior
        })
      );
      return;
    }
    close();
  };

  const close = () => {
    closeFlag = true;
    mergeAnimate.close = undefined;
    mergeAnimate.muti = 'cancel';
  };

  // 1. 检查是否有动画正在执行
  // 没有动画则进行创建，如果有新旧动画有一个可以进行取消则取消重建
  if (mergeAnimate.close === undefined || mergeAnimate.muti === 'cancel' || muti === 'cancel') {
    // 取消动画，重新创建
    mergeAnimate.close && mergeAnimate.close();
    mergeAnimate.close = close;
    mergeAnimate.muti = muti;
    mergeAnimate.x = pos.left;
    mergeAnimate.y = pos.top;
    ScrollTo(pos);
  } else {
    // 合并动画
    mergeAnimate.y = pos.top;
  }
};

const resetWhenBlankVisible = () => {
  ScrollToAnimate({
    ...limitTransformInVisibleView(transform.y, transform.x),
    behavior: 'smooth'
  });
};

// 复位至合适的位置
const resetWhenBlankVisibleDebounce = () => useDebounce()(resetWhenBlankVisible);

// 滚动条位置和滚动距离的相关系数
const blankWidthCoefficient = () => {
  const coefficient = {
    x: 1,
    y: 1
  };

  if (!scrollRef.value) return coefficient;

  /**
   *
   * ** 公式说明 **
   * 同上
   */

  const { scrollHeight, clientHeight, scrollWidth, clientWidth } = scrollRef.value;

  // top b
  if (transform.y < 0 || scrollHeight === clientHeight) {
    coefficient.y = 1 + transform.y / (0.8 * scrollHeight);
  } else if (transform.y > scrollHeight - clientHeight) {
    // bottom b
    coefficient.y = 1 - (transform.y + clientHeight - scrollHeight) / (0.8 * scrollHeight);
  }

  // left b
  if (transform.x < 0 || scrollWidth === clientWidth) {
    coefficient.x = 1 - transform.x / (0.8 * scrollWidth);
  } else if (transform.x > scrollWidth - clientWidth) {
    // right b
    coefficient.x = 1 - (transform.x + clientWidth - scrollWidth) / (0.8 * scrollWidth);
  }

  return coefficient;
};

// 滚动条限位到border之内
const LimitborderPosition = (top: number, left: number) => {
  const retPos = {
    top: top,
    left: left
  };

  if (!scrollRef.value || !props.border) return retPos;

  let touch: 'left' | 'right' | 'top' | 'bottom' | '' = '';

  const { scrollHeight, clientHeight, scrollWidth, clientWidth } = scrollRef.value;

  if (props?.border?.left && left <= -1 * props.border.left) {
    // touch left
    touch = 'left';
    retPos.left = -1 * props.border.left;
  } else if (props?.border?.right && left >= props.border.right + scrollWidth - clientWidth) {
    // touch bottom
    touch = 'right';
    retPos.left = props.border.right + scrollWidth - clientWidth;
  }

  if (props?.border?.top && top <= -1 * props.border.top) {
    // touch cell
    touch = 'top';
    retPos.top = -1 * props.border.top;
  } else if (props?.border?.bottom && top >= props.border.bottom + scrollHeight - clientHeight) {
    // touch bottom
    touch = 'bottom';
    retPos.top = props.border.bottom + scrollHeight - clientHeight;
  }

  /**
   * touch 事件在两个边缘同时触碰时只会优先执行y轴事件
   */
  if (position.value !== touch && touch !== '') {
    emits('touchBorder', { direction: touch, mouseState: 'down' }, scrollRef.value);
  }

  position.value = touch;

  return retPos;
};

/**---------------------------------------------------------------- */
// Y轴方向滚动
const handleWheel = (e: WheelEvent) => {
  // 保证空白部分不会被扯开太多，有系数 1 - top / 80% * CH
  const coefficient = blankWidthCoefficient();
  // 滚轮delta基数大，加一个额外系数来限制滚动距离
  const limitedBorderPosition = LimitborderPosition(
    (mergeAnimate.close && mergeAnimate.muti === 'merge' ? mergeAnimate.y : transform.y) +
      0.5 * e.deltaY * coefficient.y,
    (mergeAnimate.close && mergeAnimate.muti === 'merge' ? mergeAnimate.x : transform.x) +
      0.5 * e.deltaY * coefficient.x
  );
  // 处理滚动上，使用transform
  if (props.direction === 'y' || props.direction === 'both') {
    ScrollToAnimate(
      { top: limitedBorderPosition.top, left: transform.x, behavior: 'smooth' },
      'merge'
    );
  }
  if (props.direction === 'x') {
    ScrollToAnimate(
      { top: transform.y, left: limitedBorderPosition.left, behavior: 'smooth' },
      'merge'
    );
  }

  emits('scroll', e, {
    mouseState: mouseState.value,
    scroll: transform
  });

  // 事件来自于鼠标滚轮
  if (mouseState.value === 'up') {
    resetWhenBlankVisibleDebounce();
  }
};

const cancelMove = ref(false);

// 阻止移动的点击事件
const onClickCapture = (e: Event) => {
  if (cancelMove.value) {
    e.stopImmediatePropagation();
    e.stopPropagation();
  }

  cancelMove.value = false;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const syncTransform = (_x: number, y: number) => {
  transform.y = LimitborderPosition(transform.y + (y * heights.scroll) / heights.client, 0).top;
};

const { mouseState } = useMockScrollDrag(scrollRef, {
  moveMethod(pos) {
    // 移动过
    cancelMove.value = true;
    // 保证空白部分不会被扯开太多，有系数 1 - top / 80% * CH
    const coefficient = blankWidthCoefficient();
    const limitedBorderPosition = LimitborderPosition(
      transform.y - pos.calcMovementY * coefficient.y,
      transform.x - pos.calcMovementX * coefficient.x
    );
    // 处理滚动上，使用transform
    if (props.direction === 'x' || props.direction === 'both') {
      transform.x = limitedBorderPosition.left;
    }
    if (props.direction === 'y' || props.direction === 'both') {
      transform.y = limitedBorderPosition.top;
    }
    movement.x = pos.calcMovementX;
    movement.y = pos.calcMovementY;
  },
  mouseUp() {
    if (props.slide) {
      doSlide();
    }
    resetWhenBlankVisible();
  },
  mouseMove() {},
  mouseDown() {
    cancelMove.value = false;
  }
});

/**
 * 计算滚动条高度
 */
const calcSrollBarHeightThrettle = useThrettle(100);

const calcSrollBarHeight = () =>
  calcSrollBarHeightThrettle(() => {
    if (!scrollRef.value) return;
    const { scrollHeight, clientHeight } = scrollRef.value;
    if (transform.y < 0) {
      heights.scroll = scrollHeight + transform.y;
    } else {
      heights.scroll = scrollHeight;
    }
    heights.client = clientHeight;
  });

const scrollBarInit = () => {
  window.removeEventListener('resize', calcSrollBarHeight);

  if (props.scrollBehavior && props.scrollBehavior !== 'hidden') {
    window.addEventListener('resize', calcSrollBarHeight);
  }
};

defineExpose({
  scrollTo,
  getScroll: () => ({ x: transform.x, y: transform.y })
});

onMounted(() => {
  calcSrollBarHeight();
  scrollBarInit();
});

// 无条件尝试清除监听器
onUnmounted(() => {
  window.removeEventListener('resize', calcSrollBarHeight);
});

const showScroll = computed(
  () =>
    props.scrollBehavior !== 'hidden' &&
    (props.scrollBehavior === 'scroll' || heights.scroll > heights.client)
);
</script>
<template>
  <div
    class="scroll-container"
    ref="scrollRef"
    :datatype="dataType"
    @click="(e:Event) => emits('click',e)"
    @click.capture="onClickCapture"
    @wheel="handleWheel"
  >
    <div
      :class="{ 'horizontal-flow': direction === 'x' }"
      :style="{
        transform: `translate(${-1 * transform.x}px, ${-1 * transform.y}px)`
      }"
    >
      <slot></slot>
    </div>
    <slot name="extra"></slot>
    <!-- 滚动条位置依赖于外部 -->
    <ScrollBar
      v-show="showScroll"
      :heights="heights"
      :scroll-top="transform.y"
      :customScrollbar="customScrollbar || ''"
      @sync-transform="syncTransform"
      @reset-when-blank-visible="resetWhenBlankVisible"
    />
  </div>
</template>

<style scoped lang="less">
.scroll-container {
  position: relative;
  margin-right: 5px;
  overflow: hidden;
}
.horizontal-flow {
  display: inline-block;
  height: 100%;
  white-space: nowrap;
}
</style>
