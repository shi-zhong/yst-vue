import { shallowReactive } from 'vue';

export const useStack = <T>(init?: T[]) => {
  const stack = shallowReactive<T[]>(init || []);

  const push = (data: T) => {
    stack.push(data);
  };

  const pop = () => stack.pop();

  return {
    stack,
    push,
    pop
  };
};
