import AnemoPicture from '@/assets/element/anemo.webp';
import ElectroPicture from '@/assets/element/electro.webp';
import HydroPicture from '@/assets/element/hydro.webp';
import PyroPicture from '@/assets/element/pyro.webp';
import CryoPicture from '@/assets/element/cryo.webp';
import DendroPicture from '@/assets/element/dendro.webp';
import GeoPicture from '@/assets/element/geo.webp';

import AnemoPng from '@/assets/element/png/anemo.png';
import ElectroPng from '@/assets/element/png/electro.png';
import HydroPng from '@/assets/element/png/hydro.png';
import PyroPng from '@/assets/element/png/pyro.png';
import CryoPng from '@/assets/element/png/cryo.png';
import DendroPng from '@/assets/element/png/dendro.png';
import GeoPng from '@/assets/element/png/geo.png';

export enum Elements {
  // 火
  Pyro = 'pyro',
  // 水
  Hydro = 'hydro',
  // 风
  Anemo = 'anemo',
  // 雷
  Electro = 'electro',
  // 草
  Dendro = 'dendro',
  // 冰
  Cryo = 'cryo',
  // 岩
  Geo = 'geo'
}

export type ElementsChinese = '火' | '水' | '风' | '雷' | '草' | '冰' | '岩';

export const ElementPicture = {
  // 火
  pyro: PyroPicture,
  // 水
  hydro: HydroPicture,
  // 风
  anemo: AnemoPicture,
  // 雷
  electro: ElectroPicture,
  // 草
  dendro: DendroPicture,
  // 冰
  cryo: CryoPicture,
  // 岩
  geo: GeoPicture
} as const;

export const ElementPng = {
  // 火
  pyro: PyroPng,
  // 水
  hydro: HydroPng,
  // 风
  anemo: AnemoPng,
  // 雷
  electro: ElectroPng,
  // 草
  dendro: DendroPng,
  // 冰
  cryo: CryoPng,
  // 岩
  geo: GeoPng
} as const;
