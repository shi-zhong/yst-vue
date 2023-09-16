import { RemoveRepeat } from './variable';

type Types = BasicDataType | ReferanceDataType;
type NamedTypes = Types & { name: string };
type SourceTypes = SourceBasicDataType | SourceReferanceDataType;
type NamedSourceTypes = SourceTypes & { name: string };

/**
 * 基础数据类型 格式定义
 */
type BasicDataType =
  | StringType
  | NumberType
  | {
      type: 'boolean';
    };

type SourceBasicDataType = BasicDataType & {
  path: string;
  mapper?: Function;
};

type StringType = {
  type: 'string';
  verify?: ((s: string) => boolean) | RegExp;
};

type NumberType = {
  type: 'number';
  verify?: (n: number) => boolean;
};
/**
 * 引用数据格式 格式定义
 */
type ReferanceDataType = ObjDataType | ArrayDataType;
type SourceReferanceDataType = SourceObjDataType | SourceArrayDataType;

/**
 * object
 */
type ObjDataType = {
  type: 'object';
  items: NamedTypes[];
};

type SourceObjDataType = SourceObjDataTypeDirect | SourceObjDataTypeWithItems;
type SourceObjDataTypeWithItems = {
  type: 'object';
  items: NamedSourceTypes[];
};
type SourceObjDataTypeDirect = {
  type: 'object';
  path: string;
  mapper?: Function;
};

/**
 * Array
 */
type ArrayDataType = {
  type: 'array';
  each: (BasicDataType | ReferanceDataType)[] | (BasicDataType | ReferanceDataType);
  verify?: (len: number) => boolean;
};

type SourceArrayDataType = {
  type: 'array';
  path: string;
  mapper?: (value: any, index: number, array: any[]) => any;
};

const HasPath = <T extends { path: string }>(t: any): t is T => {
  return typeof t === 'object' && t.path !== undefined;
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
          return data.every((d) =>
            (mode.each as (BasicDataType | ReferanceDataType)[]).every((e) => VerifyType(e, d))
          );
        } else {
          return data.every((d) => VerifyType(mode.each as BasicDataType | ReferanceDataType, d));
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
export const TypeTransfer = (mode: SourceTypes, source: object | any[]) => {
  switch (mode.type) {
    case 'boolean': {
      return SearchPath(source, mode.path);
    }
    case 'string':
    case 'number': {
      if (typeof mode.mapper === 'function') {
        return mode.mapper(SearchPath(source, mode.path));
      } else {
        return SearchPath(source, mode.path);
      }
    }
    case 'array': {
      const arr = SearchPath(source, mode.path);
      if (arr instanceof Array && mode.mapper !== undefined) {
        return arr.map(mode.mapper);
      }
      return arr;
    }
    case 'object': {
      // 同时接受一个数组，用下标用作索引，用来约束定长类型数组
      if (HasPath<SourceObjDataTypeDirect>(mode)) {
        if (typeof mode.mapper === 'function') {
          return mode.mapper(SearchPath(source, mode.path));
        }
        return SearchPath(source, mode.path);
      } else {
        const obj: any = {};
        mode.items.map((item) => {
          obj[item.name] = TypeTransfer(item, source);
        });
        return obj;
      }
    }
  }
};

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
    const result: ObjDataType = {
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
