/**
 * 合并 data 到 reactive 对象
 * data 被 target原始对象的类型约束
 * @param target reactive 对象
 * @param data 普通对象
 */
export const merge = <T extends Record<string, any>>(target: T, data: Partial<T>) => {
  Object.keys(data).map((key: keyof T) => {
    target[key] = data[key]!;
  });
};

/**
 * 事件委派函数
 * e.currentTarget 为事件注册点 用 data-type 定义类型
 * 在子元素委托点也要用 data-type 定义， 如果冒泡过程中匹配，会返回该元素的 dataset 集合
 * 回调函数如果返回true，分发器会忽略这次匹配，继续向上匹配
 */
export const EventDispatch = <T = { [key: string]: string }>(
  e: Event,
  events: {
    [key: string]: (dataset: T) => void | boolean | undefined;
  }
): boolean => {
  const topElement = (e.currentTarget as unknown as HTMLElement).dataset.type;

  if (!topElement) {
    console.error('Unknown top element type.');
    return false;
  }

  let i = 0;
  let target = e.target as unknown as HTMLElement;
  const eventNames = Object.keys(events);

  while (i < 10) {
    if (target.dataset.type && eventNames.includes(target.dataset.type)) {
      const next = events[target.dataset.type](target.dataset as T);
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

/**
 * 正反映射函数
 * 提供一个对象，返回一个提供正反向映射的函数，需要一一对应
 * @param TtoP
 * @returns
 */
export const Transformer = <T extends string | number, P extends string | number>(
  TtoP: Readonly<Record<T, P>>
) => {
  if (!(TtoP instanceof Object)) {
    console.warn('Transformer TtoP Error.', TtoP);
    return ((o) => o) as { (o: T): P; (o: P): T };
  }

  const M: Record<T, P> & Record<P, T> = { ...TtoP } as any;

  (Object.keys(TtoP) as T[]).map((key) => {
    M[TtoP[key]] = key as any;
  });

  function Transform(o: T): P;
  function Transform(o: P): T;
  function Transform(origin: T | P) {
    return M[origin];
  }

  return Transform;
};

/**
 * 返回后缀名，最后一个.后面的部分
 * @param filename
 * @returns
 */
export const fileExt = (filename: string) => {
  let ext = '';

  for (let i = filename.length - 1; i >= 0; i--) {
    ext = filename[i] + ext;
    if (filename[i] === '.') {
      break;
    }
  }
  return ext;
};
