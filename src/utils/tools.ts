import type { DoubleSideMap, ReverseObj, StringOnly, ToString } from '@/interface/types';

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
  },
  option?: {
    maxLoop?: number;
    type?: string;
  }
): boolean => {
  const type = option?.type || 'type';
  const maxLoop = option?.maxLoop || 10;
  const topElement = e.currentTarget as unknown as HTMLElement;

  if (!topElement) {
    console.error('Unknown top element.');
    return false;
  }

  let i = 0;
  let target = e.target as unknown as HTMLElement | null;
  const eventNames = Object.keys(events);

  while (i < maxLoop && target !== null && target !== topElement) {
    if (target.dataset[type] && eventNames.includes(target.dataset[type]!)) {
      const next = events[target.dataset[type]!](target.dataset as T);
      if (!next) {
        return true;
      }
    }

    target = target.parentElement;
    i++;
  }
  return false;
};

/**
 * 将一个对象的键值进行正反整合
 */
export const DoubleSideMapObject = <
  R extends { [key: string]: string | number },
  K extends string = StringOnly<keyof R>,
  V extends R[K] = R[K]
>(
  o: Record<K, V>
): DoubleSideMap<K, V> => {
  const reverse: ReverseObj<K, V> = {} as any;
  (Object.entries(o) as [K, V][]).forEach(([k, v]: [K, V]) => (reverse[`${v}` as ToString<V>] = k));
  return { ...o, ...reverse };
};

/**
 * 正反映射函数
 */
export const Transformer = <
  R extends { [key: string]: string | number },
  K extends string = StringOnly<keyof R>,
  V extends R[K] = R[K]
>(
  o: Record<K, V>
) => {
  const no = DoubleSideMapObject(o);
  function anonymous(k: K): V;
  function anonymous(k: V): K;
  function anonymous(k: K | V) {
    return no[k as K | ToString<V>];
  }
  return anonymous;
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
  } else if (/^(\d|,)+(.\d+)?%?$/.test(data)) {
    // 成功匹配字符串
    const nData = data
      .split('')
      .filter((s) => s !== ',')
      .join('');
    if (nData.includes('%')) {
      return Number((0.01 * Number(nData.slice(0, -1))).toPrecision(15));
    } else {
      return Number(nData);
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
 * 深度克隆，同时克隆引用关系
 * @param target
 * @param parent
 * @param map
 * @returns
 */
export function DeepClone<T extends object | Array<any>>(
  target: T,
  map: Map<any, any> = new Map()
): T {
  if (target instanceof Array) {
    const copy: any = [...target];
    map.set(target, copy);
    target.map((t: any, i) => {
      if (t instanceof Object) {
        if (map.has(t)) {
          copy[i] = map.get(t);
        } else {
          copy[i] = DeepClone(t, map);
        }
      }
    });
    return copy;
  } else {
    const copy: any = { ...target };
    map.set(target, copy);
    Object.keys(copy).forEach((k) => {
      if (copy[k] instanceof Object) {
        if (map.has(copy[k])) {
          copy[k] = map.get(copy[k]);
          return;
        }
        copy[k] = DeepClone(copy[k], map);
      }
    });

    return copy;
  }
}
