import { merge } from '@/utils';
import { onMounted, onUnmounted, reactive, ref, type Ref } from 'vue';

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
  moveMethod?: (crtPos: MousePositionInfo, pvePos: MousePositionInfo, e: MouseEvent) => void;
  // 用于测试实例是否挂上
  debug?: boolean;
}

interface MousePositionInfo {
  clientX: number;
  clientY: number;
  // layerX:number;
  // layerY: number;
  movementX: number;
  movementY: number;
  offsetX: number;
  offsetY: number;
  pageX: number;
  pageY: number;
  // screenX: number;
  // screenY: number;
  calcMovementX: number;
  calcMovementY: number;
  timeStamp: number;
}

/**
 * 实现模拟滚动的钩子函数
 * @param divRef 目标div节点的 ref 对象, 内部进行判断
 * @param options 事件配置选项
 * @returns
 */
export const useMockScrollDrag = (
  divRef: Ref<HTMLDivElement | undefined>,
  options: MockScrollDragOptions
) => {
  const { mouseDown, mouseMove, mouseUp, moveMethod, debug } = options;

  const mouseState = ref<'up' | 'move' | 'down'>('up');

  const mousePosition = reactive<MousePositionInfo>({
    clientX: 0,
    clientY: 0,
    movementX: 0,
    movementY: 0,
    offsetX: 0,
    offsetY: 0,
    pageX: 0,
    pageY: 0,
    // screenX: 0,
    // screenY: 0,
    calcMovementX: 0,
    calcMovementY: 0,
    timeStamp: 0
  });

  let flag = 0;

  /**
   * 处理模拟滚动开始事件
   * @param e
   */
  const handleMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    mouseState.value = 'down';
    merge(mousePosition, getMousePostion(e));
    mouseDown && mouseDown(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (mouseState.value === 'down') {
      const _mousePosition = getMousePostion(e);
      // 同一时间戳，事件会执行两次
      if (_mousePosition.timeStamp !== mousePosition.timeStamp) {
        if (moveMethod) {
          moveMethod(_mousePosition, mousePosition, e);
        } else {
          divRef.value!.scrollTop -= _mousePosition.calcMovementY;
        }
        merge(mousePosition, _mousePosition);
      }
    }
    mouseMove && mouseMove(e, mouseState.value);
  };

  const getMousePostion = (e: MouseEvent) => {
    const { clientX, clientY, movementX, movementY, offsetX, offsetY, pageX, pageY, timeStamp } = e;

    return {
      clientX,
      clientY,
      movementX,
      movementY,
      offsetX,
      offsetY,
      pageX,
      pageY,

      calcMovementX: clientX - mousePosition.clientX,
      calcMovementY: clientY - mousePosition.clientY,
      timeStamp
    };
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
    // 防止事件被多次注册
    if (flag >= 2) return;
    if (!divRef.value) {
      if (flag !== 0)
        console.error('Error: Current ref has a undefined value.Unable to add event listener.');
      flag++;

      return;
    }
    flag = 2;
    debug && console.log('MockScroll Rigisted.');
    divRef.value.addEventListener('mousedown', handleMouseDown);
    divRef.value.addEventListener('mousemove', handleMouseMove);
  };

  /**
   * 回调执行第二次
   * 如果这个函数在onMounted中执行，这个onMounted将不会有作用
   */
  onMounted(handleRigister);
  /**
   * 第一次执行
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
