import { type WeaponsTypes } from './function';

export interface WeaponTypeModel {
  id: number;
  name: string;
  type: {
    key: string;
    value: string;
  };
  imgUrl: string;
  main: {
    key: string;
    value: [number, number];
  };
  sub: {
    key: string;
    value: [number, number];
  };
  effects: {
    name: string;
    effect: string;
  };
  describe: string;
}

export interface WeaponsModel {
  name: string;
  imgurl: string;
  type: WeaponsTypes;
  rank: 1 | 2 | 3 | 4 | 5;
  main: {
    tag: string;
    value: string;
  };
  sub?: {
    tag: string;
    value: string;
  };
  lvl: number;
  stars: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  lock: boolean;
  refine: number;
  refinedEnd: boolean;
  effect: {
    name: string;
    effectDescribe: string;
    refinedEffectAttribute: (string | number)[];
  };
  describe: string;
}
