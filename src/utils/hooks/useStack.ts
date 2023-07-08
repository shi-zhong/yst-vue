import { shallowReactive, shallowRef, type ShallowReactive, type ShallowRef } from 'vue';

/**
 *
 * @param init 数组初始化
 * @param mapper 映射函数 根据入参和栈产生符合栈的元素
 */

export interface Stack<T> {
  key: string | symbol;
  payload: T;
}

const isStackTemplate = <T>(
  mapper: undefined | Function,
  stack: ShallowReactive<Stack<T>[]> | ShallowReactive<T[]>
): stack is ShallowReactive<Stack<T>[]> => {
  return mapper !== undefined;
};

export interface useStackReturn<T, E = any> {
  stack: ShallowReactive<Stack<T>[]> | ShallowReactive<T[]>;
  top: ShallowRef<T | null>;
  push: (data: T, extra?: E) => void;
  pop: (dta?: number) => T[];
  jumpTop: (
    key: number | string | symbol | ((i: Stack<T>, index: number) => boolean)
  ) => Stack<T> | T | undefined;
  cancelMiddle: (
    key: number | string | symbol | ((i: Stack<T>, index: number) => boolean)
  ) => Stack<T> | T | undefined;
}

/**
 * overload1
 * 映射函数，由于需要第三个传参，不支持初始化
 */
export function useStack<T, E = any>(
  init: null,
  mapper: (
    stack: { stack: Stack<T>[]; toStack: (key: string | symbol, raw: T) => Stack<T> },
    data: T,
    extra: E
  ) => Stack<T>
): useStackReturn<T, E>;
/**
 * overload2
 * 映射函数， 不需要第三传参，支持初始化
 */
export function useStack<T, E = any>(
  init: T[],
  mapper?: (
    stack: { stack: Stack<T>[]; toStack: (key: string | symbol, raw: T) => Stack<T> },
    data: T
  ) => Stack<T>
): useStackReturn<T, E>;
/**
 * overload3
 * 初始化为空
 */
export function useStack<T, E = any>(): useStackReturn<T, E>;

export function useStack<T, E>(
  init?: T[] | null,
  mapper?: (
    stack: { stack: Stack<T>[]; toStack: (key: string | symbol, raw: T) => Stack<T> },
    data: T,
    extra?: E
  ) => Stack<T>
) {
  let stack: ShallowReactive<Stack<T>[]> | ShallowReactive<T[]>;

  const top = shallowRef<T | null>(null);

  if (init === null) {
    // overload1
    stack = shallowReactive<Stack<T>[]>([]);
  } else if (init === undefined || !mapper) {
    // overload3
    stack = shallowReactive<T[]>(init || []);
  } else {
    // overload2
    stack = shallowReactive<Stack<T>[]>(
      init.map((i) => mapper({ stack: stack as ShallowReactive<Stack<T>[]>, toStack }, i))
    );
  }

  // 更新栈顶
  const updateTop = () => {
    if (isStackTemplate<T>(mapper, stack)) {
      top.value = stack.length ? stack[stack.length - 1].payload : null;
    } else {
      top.value = stack.length ? stack[stack.length - 1] : null;
    }
  };

  const toStack = (key: symbol | string, raw: T) => {
    return {
      key,
      payload: raw
    };
  };

  // 入栈
  const push = (data: T, extra?: E) => {
    if (isStackTemplate<T>(mapper, stack)) {
      mapper && stack.push(mapper({ stack: stack, toStack }, data, extra));
    } else {
      stack.push(data);
    }
    updateTop();
  };

  // 出栈
  const pop = (dta?: number) => {
    let pve;
    if (typeof dta === 'number' && dta > 0) {
      pve = stack.splice(-1 * dta);
    } else {
      pve = stack.splice(-1);
    }
    updateTop();

    if (mapper) {
      return (pve as Stack<T>[]).map((i) => i.payload);
    } else {
      return pve as T[];
    }
  };

  const getIndex = (
    key: number | string | symbol | ((i: Stack<T>, index: number) => boolean)
  ): number => {
    if (typeof key === 'number') {
      return key;
    } else if (typeof key === 'string' || typeof key === 'symbol') {
      if (isStackTemplate<T>(mapper, stack)) {
        return stack.findIndex((i) => i.key === key);
      } else {
        return stack.findIndex((i) => i === key);
      }
    } else {
      return (stack as ShallowReactive<Stack<T>[]>).findIndex(key);
    }
  };

  // 中间某个弹到栈顶
  const jumpTop = (key: number | string | symbol | ((i: Stack<T>, index: number) => boolean)) => {
    const index = getIndex(key);
    if (index >= 0) {
      const jump = stack.splice(index, 1);

      if (isStackTemplate<T>(mapper, stack)) {
        mapper && stack.push(mapper({ stack: stack, toStack }, (jump[0] as Stack<T>).payload));
      } else {
        stack.push(jump[0] as T);
      }

      updateTop();
      return jump[0];
    }
  };

  const cancelMiddle = (
    key: number | string | symbol | ((i: Stack<T>, index: number) => boolean)
  ) => {
    const index = getIndex(key);

    if (index >= 0) {
      const remove = stack.splice(index, 1);
      updateTop();
      return remove[0];
    }
  };

  return {
    stack,
    top,
    push,
    pop,
    jumpTop,
    cancelMiddle
  };
}
