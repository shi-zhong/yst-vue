import { Elements, type ElementsChinese, ElementPicture } from '@/interface';

export const GetElementPicture = (element: ElementsChinese) => {
  return ElementPicture[GetElementReflect(element)];
};

/**
 * 获得中文元素的英文标识符
 *  */
export const GetElementReflect = (element: ElementsChinese) => {
  switch (element) {
    //
    case '风':
      return Elements.Anemo;
    case '雷':
      return Elements.Electro;
    case '水':
      return Elements.Hydro;
    case '火':
      return Elements.Pyro;
    case '冰':
      return Elements.Cryo;
    case '草':
      return Elements.Dendro;
    case '岩':
      return Elements.Geo;
  }
};

/**
 * 从元素标识符获取元素中文
 */
export const GetElementChinese = (element: Elements): ElementsChinese => {
  switch (element) {
    case Elements.Anemo:
      return '风';
    case Elements.Electro:
      return '雷';
    case Elements.Hydro:
      return '水';
    case Elements.Pyro:
      return '火';
    case Elements.Cryo:
      return '冰';
    case Elements.Dendro:
      return '草';
    case Elements.Geo:
      return '岩';
  }
};
