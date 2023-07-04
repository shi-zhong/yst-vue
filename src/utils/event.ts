
/**
 * 事件委派函数
 * e.currentTarget 为事件注册点 用 data-type 定义类型
 * 在子元素委托点也要用 data-type 定义， 如果冒泡过程中匹配，会返回该元素的 dataset 集合
 * 回调函数如果返回true，分发器会忽略这次匹配，继续向上匹配
 */
export const EventDispatch = (
  e: Event,
  events: {
    [key: string]: (dataset: DOMStringMap) => void | boolean | undefined;
  }
): boolean => {
  const topElement = (e.currentTarget as unknown as HTMLElement).dataset.type;

  if (!topElement) {
    console.error('Unknown top element type.');
  }

  let i = 0;
  let target = e.target as unknown as HTMLElement;
  const eventNames = Object.keys(events);

  while (i < 10) {
    if (target.dataset.type && eventNames.includes(target.dataset.type)) {
      const next = events[target.dataset.type](target.dataset);
      if (!next) {
        return true;
      }
    } else if (target.dataset.type === topElement) {
      return false;
    }

    if (target.parentElement && target.parentElement !== null) {
      target = target.parentElement;
    } else {
      return false;
    }
    i++;
  }
  return false;
};
