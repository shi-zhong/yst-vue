import { Element } from '@shi-zhong/genshin-ui';

const { ElementWebp } = Element;

const temp: Record<Element.ElementsChinese, Element.ElementsCode> = {
  '\u706B': 'Pyro',
  '\u6C34': 'Hydro',
  '\u98CE': 'Anemo',
  '\u96F7': 'Electro',
  '\u8349': 'Dendro',
  '\u51B0': 'Cryo',
  '\u5CA9': 'Geo'
};

export const GetElementPicture = (element: Element.ElementsChinese) => {
  return ElementWebp[temp[element]];
};
