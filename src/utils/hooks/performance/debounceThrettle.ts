/**
 * 创建防抖函数
 * @param callback 回调函数
 * @param wait 防抖触发阈值
 * @returns 防抖函数
 */
export const useDebounce = (wait?: number) => {
  let timeout: number = 0;

  return (callback: () => void) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback();
    }, wait || 250);
  };
};

/**
 * 创建节流函数
 * @param callback 回调函数
 * @param gap 节流间隔
 * @returns 节流函数
 */
export const useThrettle = (gap: number) => {
  let waiting = false;
  let fn: number;

  return (callback: () => void) => {
    if (waiting) {
      clearTimeout(fn);
      fn = setTimeout(() => {
        callback();
      }, gap || 100);
    } else {
      callback();
      waiting = true;
      clearTimeout(fn);
      setTimeout(() => {
        waiting = false;
      }, gap || 100);
    }
  };
};
