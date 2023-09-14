import { GetTrueType, type ParameterArrayToVariableString, type StringArrayToSingleString, type UnionToIntersection } from "@/interface/types";

/**
 * 通过 ParameterArrayToVariableString 获取 参数数组的类型的string版本
 * 通过 StringArrayToSingleString 获取 字符串数组 的 链接
 */
export type OverlaodProps<
  T extends { [key: string]: (...argu: any[]) => any }
> = {
  [key in keyof T]?: {
    argus: StringArrayToSingleString<
      ParameterArrayToVariableString<Parameters<T[key]>>,
      '/'
    >;
    fn: T[key];
  };
};

/**
 * 根据泛型获取OverloadAdder的函数联合
 */
type OverLoadAdder<
  T extends { [key: string]: (...argu: any[]) => any },
  K = keyof T
> = K extends keyof T
  ? (
      k: K,
      a: StringArrayToSingleString<
        ParameterArrayToVariableString<Parameters<T[K]>>,
        '/'
      >,
      fn: T[K]
    ) => void
  : never;

/**
 * 根据泛型获取OverloadFn的函数重载
 */
export type OverloadFn<T extends { [key: string]: (...argu: any[]) => any }> =
  UnionToIntersection<T[keyof T]> & {
    OverLoadAdder: UnionToIntersection<OverLoadAdder<T>>;
    default: (i?: string) => {};
  } & T;

/**
 * 自定义重载函数，通过配置入参来自动调用重载
 *
 * 使用泛型来获得自动重载的类型提示，每个重载需要用唯一的命名
 *
 * 如果在初始化时无法确认函数，后续可通过OverLoad.OverloadAdder 函数进行重载添加
 *
 * @param types
 * @returns
 */
export const OverLoad = <T extends { [key: string]: (...argu: any[]) => any }>(
  types: OverlaodProps<T>
) => {
  const mapper = new Map<string, Function>();
  const overloadFn: any = (...argus: any) => {
    const i = argus.map((i: any) => GetTrueType(i)).join('/');

    if (mapper.has(i)) {
      return mapper.get(i)!(...argus);
    } else {
      return overloadFn.default(i);
    }
  };

  overloadFn.default = (i: string) => {
    console.error('No Function Overload Matched.', i);
    return 'No Function Overload Matched.';
  };

  // 动态添加重载函数
  const OverLoadAdder = (key: keyof T, argus: string, fn: Function) => {
    overloadFn[key] = fn;
    mapper.set(argus, fn);
  };

  for (const key in types) {
    OverLoadAdder(key, types[key]!.argus, types[key]!.fn);
  }

  overloadFn.OverLoadAdder = OverLoadAdder;

  return overloadFn as unknown as OverloadFn<T>;
};