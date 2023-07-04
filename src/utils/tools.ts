/**
 * 合并 data 到 reactive 对象
 * @param target reactive 对象
 * @param data 普通对象
 */
export const merge = (target: Record<string, any>, data: Record<string, any>) => {
  Object.keys(data).map((key) => {
    target[key] = data[key];
  });
};
