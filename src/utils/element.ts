import { Elements, type ElementsChinese, ElementPicture } from '@/interface';
import { Transformer } from './tools';

export const GetElementPicture = (element: ElementsChinese) => {
  return ElementPicture[ElementReflect(element)];
};

export const ElementReflect = Transformer<Record<ElementsChinese, Elements>>({
  风: Elements.Anemo,
  雷: Elements.Electro,
  水: Elements.Hydro,
  火: Elements.Pyro,
  冰: Elements.Cryo,
  草: Elements.Dendro,
  岩: Elements.Geo
} as const);

// 当 一个对象 没有被定义为 const常量时， typeof 无法锁定对象的值类型，而是会推导成 string 类型
