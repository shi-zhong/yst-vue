import { type Directive } from 'vue';

/**
 * 长按指令
 * 1. 接受一个纯数字arg作为长按前置阈值
 * 2. 接受一个 mouseDown 函数，可以通过返回一个函数来取消副作用
 *
 * clickCancel 用于在长按触发后取消 onclick事件
 */

export const LongPress = (): { vLong: Directive<HTMLElement, Function>; clickCancel: Function } => {
  let longPressFlag = false;
  return {
    vLong: {
      mounted(el, binding) {
        const mouseDown = () => {
          let mouseupCancelCallback: any;
          const timeout = setTimeout(() => {
            longPressFlag = true;
            mouseupCancelCallback = binding.value(window, document);
          }, Number(binding.arg) || 1000);

          const cancel = () => {
            clearTimeout(timeout);
            mouseupCancelCallback && mouseupCancelCallback();
            document.removeEventListener('mousemove', cancel);
            document.removeEventListener('mouseup', cancel);
          };

          document.addEventListener('mouseup', cancel);
          document.addEventListener('mousemove', cancel);
        };

        el.addEventListener('mousedown', mouseDown);
      }
    },
    clickCancel: (fn: Function) => {
      if (longPressFlag) {
        longPressFlag = false;
        return;
      }
      fn();
    }
  };
};
