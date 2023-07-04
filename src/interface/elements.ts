import AnemoPicture from '@/assets/element/anemo.webp';
import ElectroPicture from '@/assets/element/electro.webp';
import HydroPicture from '@/assets/element/hydro.webp';
import PyroPicture from '@/assets/element/pyro.webp';
import CryoPicture from '@/assets/element/cryo.webp';
import DendroPicture from '@/assets/element/dendro.webp';
import GeoPicture from '@/assets/element/geo.webp';

export enum Elements {
  // 风
  Anemo = 'anemo',
  // 雷
  Electro = 'electro',
  // 水
  Hydro = 'hydro',
  // 火
  Pyro = 'pyro',
  // 冰
  Cryo = 'cryo',
  // 草
  Dendro = 'dendro',
  // 岩
  Geo = 'geo',
}

export type ElementsChinese = '风' | '雷' | '水' | '火' | '冰' | '草' | '岩';

export const ElementPicture = {
  // 风
  anemo: AnemoPicture,
  // 雷
  electro: ElectroPicture,
  // 水
  hydro: HydroPicture,
  // 火
  pyro: PyroPicture,
  // 冰
  cryo: CryoPicture,
  // 草
  dendro: DendroPicture,
  // 岩
  geo: GeoPicture,
};
