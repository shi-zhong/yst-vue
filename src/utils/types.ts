import { RemoveRepeat } from './array';
/**
 * VerifyType
 */
type Types = StringType | NumberType | BooleanType | ObjType | ArrayType;
type NamedTypes = Types & { name: string };

type StringType = {
  type: 'string';
  verify?: ((s: string) => boolean) | RegExp;
};

type NumberType = {
  type: 'number';
  verify?: (n: number) => boolean;
};

type BooleanType = {
  type: 'boolean';
};

type ObjType = {
  type: 'object';
  items: NamedTypes[];
};

type ArrayType = {
  type: 'array';
  each: Types[] | Types;
  verify?: (len: number) => boolean;
};

/*
 * TypeTransfer
 * 不使用数据类型进行区分，根据操作类型进行配置
 */
type SourceTypes = SourceDirect | SourceObject | SourceArray;

type SourceDirect = {
  type: 'direct';
  mapper?: (i: any) => any;
};

type SourceObject = {
  type: 'object';
  items: (SourceTypes & { name: string; path?: string })[];
};

type SourceArray = {
  type: 'array';
  items: (SourceTypes & { path: string })[];
};

/**
 * 使用TS获取类型提示
 * @param mode 匹配模式
 * @param data 匹配数据
 * @returns
 */
export const VerifyType = <T>(mode: Types, data: any): data is T => {
  switch (mode.type) {
    case 'boolean': {
      return typeof data === 'boolean';
    }
    case 'string': {
      if (typeof data === 'string') {
        if (mode.verify !== undefined) {
          if (typeof mode.verify === 'function') {
            return mode.verify(data);
          } else if (mode.verify instanceof RegExp) {
            return mode.verify.test(data);
          } else {
            console.error('String Verify Error.');
          }
        }
        return true;
      }
      return false;
    }
    case 'number': {
      if (typeof data === 'number') {
        if (mode.verify !== undefined) {
          if (typeof mode.verify === 'function') {
            return mode.verify(data);
          }
        }
        return true;
      }
      return false;
    }
    case 'array': {
      if (data instanceof Array) {
        // 校验长度
        if (mode.verify && typeof mode.verify === 'function' && !mode.verify(data.length)) {
          return false;
        }
        // 处理数据
        if (mode.each instanceof Array) {
          return data.every((d) => (mode.each as Types[]).every((e) => VerifyType(e, d)));
        } else {
          return data.every((d) => VerifyType(mode.each as Types, d));
        }
      }
      return false;
    }
    case 'object': {
      // 同时接受一个数组，用下标用作索引，用来约束定长类型数组
      if (typeof data === 'object') {
        const keys = Object.keys(data);
        for (const item of mode.items) {
          // check key
          if (!keys.includes(item.name)) return false;
          // if false -> false
          if (!VerifyType(item, data[item.name])) {
            return false;
          }
        }
        return true;
      }
      return false;
    }
  }
};

/**
 * 从对象或者数组上获取路径数据
 * @param target
 * @param path path.path.. 使用 . 拆分路径
 */
export const SearchPath = (target: object | any[], path: string) => {
  const splitPath = path.split('.');
  let t = target;
  const find = splitPath.some((n) => {
    if (typeof t === 'object' && (t as any)[n] !== undefined) {
      t = (t as any)[n];
      return false;
    }
    return true;
  });
  return find ? undefined : t;
};

/**
 * 从一个对象上提取数据，组合成另一个数据
 * @param mode
 * @param source
 */
function TypeTransferWithDirect(
  mode: (SourceTypes & { name: string; path?: string }) | (SourceTypes & { path: string }),
  source: object | any[],
  base: string = ''
): any {
  /**
   * mode 拥有 path 和 name 属性，path 代表路径，path 不存在时， name可作为相对路径
   * 以$开头代表相对路径
   */
  switch (mode.type) {
    case 'direct': {
      const path = mode.path ? mode.path.replace('$', base) : base + (mode as any).name!;
      return mode.mapper ? mode.mapper(SearchPath(source, path)) : SearchPath(source, path);
    }
    case 'array': {
      return mode.items.map((item) => TypeTransferWithDirect(item, source));
    }
    case 'object': {
      const obj: any = {};
      // 处理前缀, 使用path定义上下文，上下文只在当前直接上下文有效
      const path = mode.path !== undefined ? mode.path + '.' : '';
      mode.items.map((item) => (obj[item.name] = TypeTransferWithDirect(item, source, path)));
      return obj;
    }
  }
}

/**
 * 从一个对象上提取数据，组合成另一个对象或者数组
 * @param mode
 * @param source
 */
export function TypeTransfer<T = unknown>(mode: SourceObject, source: object | any[]): T;
export function TypeTransfer<T = unknown>(mode: SourceArray, source: object | any[]): T[];
export function TypeTransfer<T>(mode: SourceObject | SourceArray, source: object | any[]) {
  switch (mode.type) {
    case 'array': {
      return mode.items.map((item) => TypeTransferWithDirect(item, source));
    }
    case 'object': {
      const obj: any = {};
      mode.items.map((item) => (obj[item.name] = TypeTransferWithDirect(item, source)));
      return obj as T;
    }
  }
}

/**
 * 传入一个类型， 返回类型的 Types 类型
 * @param { string | number | boolean | array | object} target
 * @returns
 */
export const ReadTypeFrom = (target: any): Types => {
  if (['string', 'number', 'boolean'].includes(typeof target)) {
    return { type: typeof target as 'string' | 'number' | 'boolean' };
  }
  if (target instanceof RegExp) {
    return { type: 'string', verify: target };
  } else if (target instanceof Array) {
    return { type: 'array', each: RemoveRepeat(target.map((i) => ReadTypeFrom(i))) };
  } else if (target instanceof Object) {
    const key = Object.keys(target);
    const result: ObjType = {
      type: 'object',
      items: []
    };
    key.map((k) =>
      result.items.push({
        name: k,
        ...ReadTypeFrom(target[k])
      })
    );
    return result;
  }
  return { type: 'boolean' };
};
