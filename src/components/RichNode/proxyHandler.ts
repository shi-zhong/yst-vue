import type { RichNode } from '.';

const Effect = [];


export const createProxy = (init: RichNode[], update: Function) => {
  return new Proxy(init, {
    get(target, key: string, receiver) {
      if (['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'].includes(key)) {
        //
      }
      return Reflect.get(target, key, receiver);
    },
    set(target, key: string, value: RichNode, receiver) {
      // 禁止越界访问
      if (parseInt(key) >= target.length) return false;
      Reflect.set(target, key, value, receiver);
      value.merge();
      return true;
    },
    deleteProperty(target, p) {
        return true;
    },
  });
};
