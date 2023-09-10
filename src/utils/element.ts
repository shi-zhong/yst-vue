import { Elements, type ElementsChinese, ElementPicture } from '@/interface';

export const GetElementPicture = (element: ElementsChinese) => {
  return ElementPicture[ElementReflect(element)];
};

const ElementsMapper = (() => {
  const map = new Map<string, string>();

  map.set('风', Elements.Anemo);
  map.set('雷', Elements.Electro);
  map.set('水', Elements.Hydro);
  map.set('火', Elements.Pyro);
  map.set('冰', Elements.Cryo);
  map.set('草', Elements.Dendro);
  map.set('岩', Elements.Geo);

  map.set(Elements.Anemo, '风');
  map.set(Elements.Electro, '雷');
  map.set(Elements.Hydro, '水');
  map.set(Elements.Pyro, '火');
  map.set(Elements.Cryo, '冰');
  map.set(Elements.Dendro, '草');
  map.set(Elements.Geo, '岩');
  return map;
})();

function ElementReflect(element: ElementsChinese): Elements;
function ElementReflect(element: Elements): ElementsChinese;
function ElementReflect(element: ElementsChinese | Elements) {
  return ElementsMapper.get(element);
}

export { ElementReflect };
