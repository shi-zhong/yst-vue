import { onMounted, onUnmounted, ref, type Ref } from 'vue';

interface MockScrollDragOptions {
  mouseDown?: (e?: MouseEvent) => void;
  /**
   * 鼠标移动事件
   * @param e
   * @param mouseState 鼠标状态
   * @returns
   */
  mouseMove?: (e: MouseEvent, mouseState: 'up' | 'move' | 'down') => void;
  mouseUp?: (e?: MouseEvent) => void;
  moveMethod?: (e?: MouseEvent) => void;
  // 用于测试实例是否挂上
  debug?: boolean;
}

/**
 * 实现模拟滚动的钩子函数
 * @param divRef 目标div节点的 ref 对象, 内部进行判断
 * @param options 事件配置选项
 * @returns
 */
export const useMockScrollDrag = (divRef: Ref<HTMLDivElement>, options: MockScrollDragOptions) => {
  const { mouseDown, mouseMove, mouseUp, moveMethod, debug } = options;

  const mouseState = ref<'up' | 'move' | 'down'>('up');

  let flag = false;

  /**
   * 处理模拟滚动开始事件
   * @param e
   */
  const handleMouseDown = (e: MouseEvent) => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    mouseState.value = 'down';
    mouseDown && mouseDown(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (mouseState.value === 'down') {
      if (moveMethod) {
        moveMethod(e);
      } else {
        divRef.value.scrollTop -= e.movementY;
      }
    }
    mouseMove && mouseMove(e, mouseState.value);
  };

  /**
   * 处理模拟滚动结束事件
   * @param e
   */
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    mouseState.value = 'up';
    mouseUp && mouseUp(e);
  };

  const handleRigister = () => {
    if (flag) return;
    if (!divRef.value) {
      options.debug &&
        console.error('Error: Current ref has a undefined value.Unable to add event listen.');
      return;
    }
    flag = true;
    debug && console.log('MockScroll Rigisted.');
    divRef.value.addEventListener('mousedown', handleMouseDown);
    divRef.value.addEventListener('mousemove', handleMouseMove);
  };

  /**
   * 如果这个函数在onMounted中执行，这个onMounted将不会有作用
   */
  onMounted(handleRigister);
  /**
   * 配合onMounted，保证实例一定被挂上监听器
   */
  handleRigister();

  onUnmounted(() => {
    if (!divRef.value) {
      return;
    }
    divRef.value.removeEventListener('mousedown', handleMouseDown);
    divRef.value.removeEventListener('mousemove', handleMouseMove);
  });

  debug && console.log('MockScrollDrag runned. Ref value is', divRef.value);

  return {
    mouseState
  };
};
