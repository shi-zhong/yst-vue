export type ToString<T extends string | number> = T extends string ? T : `${T}`;

export type DoubleSideMap<K extends string, V extends string | number> = Record<K, V> &
  ReverseObj<K, V>;

export type ReverseObj<K extends string, V extends string | number> = Record<ToString<V>, K>;

export type StringOnly<T extends string | number | symbol> = T extends string ? T : never;
