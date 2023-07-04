<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDebounce, useMockScrollDrag } from '@/utils/hooks';

interface ScrollViewProps {
  dataType?: string;
  slide?: boolean;
  slideOption?: {
    threshold: number;
    distance: (i: number) => number;
  };
  blank: {
    top: number;
    bottom: number;
  };
}

interface ScrollViewEmits {
  (event: 'click', e: Event): void;
  (
    event: 'touchCell',
    payload: {
      type: 'up-top' | 'up-bottom' | 'move-top' | 'move-bottom';
      ref: any;
    }
  ): void;
  (
    event: 'touchBottom',
    payload: {
      type: 'up-top' | 'up-bottom' | 'move-top' | 'move-bottom';
      ref: any;
    }
  ): void;
  (event: 'scroll', e: Event, mouseState: 'up' | 'move' | 'down'): void;
}

const props = defineProps<ScrollViewProps>();
const emits = defineEmits<ScrollViewEmits>();

const scrollRef = ref();

// 记录上一个滑动的值，当mouseup时处理滑动效果
const preSlide = ref(0);
const position = ref('');

onMounted(() => {
  if (scrollRef.value) {
    scrollRef.value.scrollTop = props.blank.top;
  }
});

// 设置滑动
const doSlide = () => {
  // 自定义滑动阈值
  if (Math.abs(preSlide.value) > ((props.slideOption && props.slideOption.threshold) || 1)) {
    scrollRef.value.scrollTo({
      left: 0,
      top: limitSlideTopInVisibleView(
        props.slideOption
          ? props.slideOption.distance(preSlide.value)
          : scrollRef.value.scrollTop - 30 * preSlide.value
      ),
      behavior: 'smooth'
    });
    preSlide.value = 0;
  }
};

// 将滑动距离限制在visible区域内
const limitSlideTopInVisibleView = (top: number) => {
  const { scrollHeight, clientHeight } = scrollRef.value;

  if (top < props.blank.top) {
    return props.blank.top;
  } else if (top > scrollHeight - clientHeight - props.blank.bottom) {
    return scrollHeight - clientHeight - props.blank.bottom;
  }
  return top;
};

// 复位至合适的位置
const resetWhenBlankVisible = () => {
  if (scrollRef.value) {
    const { scrollTop } = scrollRef.value;
    scrollRef.value.scrollTo({
      left: 0,
      top: limitSlideTopInVisibleView(scrollTop),
      behavior: 'smooth'
    });
  }
};

const handleMouseMove = (e: MouseEvent, mouseState: 'up' | 'move' | 'down') => {
  if (scrollRef.value && mouseState === 'down') {
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.value;

    preSlide.value = e.movementY;
    // 处理触(顶)底事件
    if (position.value !== 'move-top' && scrollRef.value.scrollTop === 0) {
      // 触顶 只能触发一次
      position.value = 'move-top';
      emits('touchCell', { type: 'move-top', ref: scrollRef.value });
    } else if (position.value !== 'move-bottom' && scrollTop === scrollHeight - clientHeight) {
      position.value = 'move-bottom';
      emits('touchBottom', { type: 'move-bottom', ref: scrollRef.value });
    } else {
      position.value = '';
    }
  }
};

const handleScrollEnd = () => {
  if (props.slide) {
    doSlide();
  }

  const { scrollTop, scrollHeight, clientHeight } = scrollRef.value;

  if (scrollRef.value.scrollTop === 0) {
    // 触顶 只能触发一次
    emits('touchCell', { type: 'up-top', ref: scrollRef });
  } else if (scrollTop === scrollHeight - clientHeight) {
    emits('touchBottom', { type: 'up-bottom', ref: scrollRef });
  }

  position.value = '';

  resetWhenBlankVisible();
};

// 注册滚动效果事件
const { mouseState } = useMockScrollDrag(scrollRef, {
  mouseMove: handleMouseMove,
  mouseUp: handleScrollEnd
});

// ???
const onClickCapture = (e: Event) => {
  if (mouseState.value === 'move') {
    e.stopPropagation();
  }

  mouseState.value = 'up';
};

// 函数防抖
const resetWhenBlankVisibleDebounce = useDebounce();

const handleScroll = (e: Event) => {
  emits('scroll', e, mouseState.value);
  // 事件来自于鼠标滚轮
  if (mouseState.value === 'up') {
    resetWhenBlankVisibleDebounce(resetWhenBlankVisible);
  }
};

defineExpose({
  scrollRef,
  resetWhenBlankVisible
});
</script>

<template>
  <!-- 尽量做到与外部容器一致大小 -->
  <div
    ref="scrollRef"
    class="scroll-view-visible"
    :data-type="props.dataType"
    @click="(e:Event) => emits('click',e)"
    @click.capture="onClickCapture"
    @scroll="handleScroll"
  >
    <div :style="{ height: `${props.blank.top}px` }"></div>
    <div style="min-height: 100%"><slot></slot></div>
    <div :style="{ height: `${props.blank.bottom}px` }"></div>
  </div>
</template>

<style scoped lang="less">
.scroll-view-visible {
  height: 100%;
  overflow: hidden scroll;
  scrollbar-width: none;
  scrollbar-color: transparent;
  flex-grow: 1;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
