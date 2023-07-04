<script setup lang="ts">
import {
  computed,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  useAttrs
} from 'vue';
import ScrollView from './HookScroll.vue';
import { useMockScrollDrag, useThrettle } from '@/utils/hooks';

interface ScrollViewProps {
  customScrollbar?: string;
  scrollBehavior?: 'auto' | 'scroll' | 'hidden';
  rootClass?: string;
  blank?: {
    top?: number;
    bottom?: number;
  };
}
// 变量声明
const props = withDefaults(defineProps<ScrollViewProps>(), {
  scrollBehavior: 'auto'
});
const attr = useAttrs();

const thumbRef = ref();
const scrollViewComponentRef = ref();
const scrollViewRef = ref();

const style = reactive({
  height: 0,
  transform: 0,
  show: false
});

const scrollTopBackup = ref(0);

const computedStyle = computed(() => ({
  height: `${style.height}px`,
  transform: `translateY(${style.transform}px)`
}));

const showScroll = computed(
  () =>
    props.scrollBehavior &&
    props.scrollBehavior !== 'hidden' &&
    (props.scrollBehavior === 'scroll' || style.show)
);

const blanks = computed(() => ({
  top: props?.blank?.top === undefined ? 100 : props.blank.top,
  bottom: props?.blank?.bottom === undefined ? 100 : props.blank.bottom
}));

defineOptions({
  inheritAttrs: false
});

/**
 * 计算滚动条高度
 */
const calcSrollBarHeightThrettle = useThrettle(100)

const calcSrollBarHeight = () => calcSrollBarHeightThrettle(() => {
  const { scrollHeight, clientHeight } = scrollViewRef.value;

  style.height =
    (clientHeight * clientHeight) / (scrollHeight - blanks.value.top - blanks.value.bottom);
  style.show = style.height < clientHeight;
})


const scrollBarInit = () => {

  window.removeEventListener('resize', calcSrollBarHeight);

  if (props.scrollBehavior && props.scrollBehavior !== 'hidden') {
    window.addEventListener('resize', calcSrollBarHeight);
  }
};

onMounted(() => {
  if (scrollViewComponentRef.value !== undefined) {
    scrollViewRef.value = scrollViewComponentRef.value.scrollRef;
    scrollBarInit();

    // 滚动事件只注册一次
    useMockScrollDrag(thumbRef, {
      moveMethod(e) {
        const { scrollHeight, clientHeight } = scrollViewRef.value;
        // 直接改变主体scrollTop， 滚动条会自己更新
        scrollViewRef.value.scrollTop +=
          ((e?.movementY || 0) * (scrollHeight - 200)) / clientHeight;
      },
      mouseUp() {
        scrollViewComponentRef.value.resetWhenBlankVisible();
      }
    });
  }
});

// 无条件尝试清除监听器
onUnmounted(() => {
  window.removeEventListener('resize', calcSrollBarHeight);
});

const onScroll = () => {
  if (scrollViewRef.value) {
    const { scrollTop, scrollHeight, clientHeight } = scrollViewRef.value;

    style.transform =
      ((scrollTop - blanks.value.top) / (scrollHeight - blanks.value.top - blanks.value.bottom)) *
      clientHeight;
  } else {
    style.transform = 0;
  }
};

// 暴露至外部
const scrollTo = (pos: number, smooth?: boolean) => {
  const { scrollHeight, clientHeight } = scrollViewRef.value;
  const truePos = pos + blanks.value.top;
  const maxTop = scrollHeight - blanks.value.bottom - clientHeight;

  scrollViewRef.value?.scrollTo({
    left: 0,
    top: truePos < maxTop ? truePos : maxTop,
    behavior: smooth ? 'smooth' : 'auto'
  });
};

const getScrollTop = () => {
  return scrollViewRef.value.scrollTop - blanks.value.top;
};

onDeactivated(() => {
  scrollTopBackup.value = getScrollTop();
});

onActivated(() => {
  scrollTo(scrollTopBackup.value);
});

defineExpose({
  scrollTo,
  getScrollTop
});
</script>
<template>
  <div :class="'scroll-container ' + (props?.rootClass || '')">
    <ScrollView
      v-bind="attr"
      :blank="blanks"
      ref="scrollViewComponentRef"
      @scroll="onScroll"
    >
      <slot></slot>
    </ScrollView>
    <div
      v-show="showScroll"
      :class="'scroll-track ' + (props.customScrollbar || '')"
    >
      <div
        class="scroll-thumb"
        ref="thumbRef"
        :style="computedStyle"
        @dragstart.stop.prevent="() => {}"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.scroll-container {
  display: flex;
  overflow: hidden;
}
.scroll {
  @width: 5px;
  &-track {
    flex-shrink: 0;
    background: rgba(76, 76, 76, 0.3);
    width: @width;
    height: 100%;
    overflow: hidden;
    margin-left: 5px;
  }
  &-thumb {
    width: 5px;
    background: rgba(217, 217, 217, 0.5);
    border-radius: 2px;
    transition: 'width' 0.3s;

    &:hover {
      background: rgba(217, 217, 217, 0.8);
    }
  }
}
</style>
