/**
 * 状态机描述系统中的所有状态，状态之间的转换和相应的条件
 * 接收到一个参数之后，状态机根据自身状态，转移到新的状态
 * @param stateOptioms
*/
import { shallowRef, type ShallowRef } from 'vue';

export type StateMachineOption<K extends string | symbol> = {
  [key in K]: {
    condition?: string | number | symbol | Function;
    to: K;
  }[];
};

export type StateMachineReturnType<T> = {
  state: ShallowRef<T>;
  next(condition: string | symbol | number): boolean;
};

export const useStateMachine = <T extends string | symbol>(
  stateOptions: StateMachineOption<T>,
  init: T
): StateMachineReturnType<T> => {
  const state = shallowRef<T>(init);
  const next = (condition: string | symbol | number) => {
    const stateMapper = stateOptions[state.value];

    stateMapper?.findIndex((mapper) => {
      if (mapper.condition === undefined) {
        if (condition !== mapper.to) {
          return false;
        }
      } else if (
        typeof mapper.condition === 'string' ||
        typeof mapper.condition === 'number' ||
        typeof mapper.condition === 'symbol'
      ) {
        if (condition !== mapper.condition) {
          return false;
        }
      } else if (mapper.condition instanceof Function) {
        if (mapper.condition(condition) !== mapper.to) {
          return false;
        }
      }

      state.value = mapper.to;
      return true;
    });

    return false;
  };

  return {
    state,
    next
  };
};
