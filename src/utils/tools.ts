import type { ComponentInternalInstance } from 'vue';

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
 * 使用exclu
 * @param TtoP
 * @param exclude 取消反向映射的键值，用于值有重复的时候
 * @returns
 */
export const Transformer = <
  R extends { [key: string | number | symbol]: string | number | symbol },
  T extends string | number | symbol = keyof R,
  P extends string | number | symbol = R[keyof R]
>(
  TtoP: Readonly<Record<T, P>>,
  exclude?: T[]
) => {
  if (!(TtoP instanceof Object)) {
    console.warn('Transformer TtoP Error.', TtoP);
    return ((o) => o) as { (o: T): P; (o: P): T };
  }

  const M: Record<T, P> & Record<P, T> = { ...TtoP } as any;

  (Object.keys(TtoP) as T[]).map((key) => {
    if (!exclude || !exclude.includes(key)) {
      M[TtoP[key]] = key as any;
    }
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

/**
 * 将数字或字符串编码成百分比格式或从百分比格式还原
 * 字符串转换需要匹配 /^\d+.?\d+%?$/ => 10.54% | 10 | 10.54
 * 因为精度问题，会调用toPrecision(15)
 * @param data
 */
export function DataDecoder(data: string): number;
export function DataDecoder(data: number, fix?: number): string;
export function DataDecoder(data: number | string, fix?: number) {
  if (typeof data === 'number') {
    if (data > 1) {
      return fix === undefined ? data + '' : data.toFixed(fix);
    } else {
      return fix === undefined
        ? Number((data * 100).toPrecision(15)) + '%'
        : Number((data * 100).toFixed(15)).toFixed(fix) + '%';
    }
  } else if (/^\d+.?\d?%?$/.test(data)) {
    // 成功匹配字符串
    if (data.includes('%')) {
      return Number((0.01 * Number(data.slice(0, -1))).toPrecision(15));
    } else {
      return Number(data);
    }
  } else {
    return 0;
  }
}

export const DownLoadJson = (origin: object, file_name: string) => {
  const tmpLink = document.createElement('a');

  const blob = new File([JSON.stringify(origin, null, 2)], file_name, {
    type: 'text/plain'
  });

  const objectUrl = URL.createObjectURL(blob);
  tmpLink.href = objectUrl;

  tmpLink.download = file_name;

  tmpLink.click();
  URL.revokeObjectURL(objectUrl);
};

/**
 * 获取最近的父组件实例, 为了避免重名，需要在父组件中暴露类型为 symbol 的 type 属性
 * @param current getCurrentInstance
 * @param parentSymbol parentSymbol
 * @returns
 */
export function GetParentInstance(
  current: ComponentInternalInstance | null,
  parentSymbol: symbol
): ComponentInternalInstance | null {
  let cur = current;

  while (cur !== null) {
    if (cur.exposed && cur.exposed.type === parentSymbol) {
      return cur;
    }
    cur = cur.parent;
  }
  return cur;
}
