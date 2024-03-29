import { Element } from '@shi-zhong/genshin-ui';

// 每个角色实例的基本信息
export interface CharacterInstanceBasicModel {
  id: number;
  character_id: number;
  lvl: number;
  talents: [number, number, number];
  lives: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface CharacterInstanceExpandModel extends CharacterInstanceBasicModel {
  name: string;
  star: 1 | 2 | 3 | 4 | 5;
  eName: string;
  element: Element.ElementsChinese;
}

// 角色(共性)信息
export interface CharacterModel {
  id: number;
  uuid: number;
  basic: CharacterBasicModel;
  break_through_levels: [number, number, number][];
  material: {
    boss: string;
    specialty: string;
    drops: string;
  };
  talents: CharacterTalentsModel[];
  lives: CharacterConstellationModel[];
}

// 角色基础信息
export interface CharacterBasicModel {
  name: string;
  star: 1 | 2 | 3 | 4 | 5;
  eName: string;
  element: Element.ElementsChinese;
  weapon: number;
  birth: string;
  belong: string;
  life: string;
  honor: string;
  break_through: string;
  intro: string;
}

type Levels =
  | '1'
  | '20'
  | '20+'
  | '40'
  | '40+'
  | '50'
  | '50+'
  | '60'
  | '60+'
  | '70'
  | '70+'
  | '80'
  | '80+'
  | '90';

// 命之座信息
export interface CharacterConstellationModel {
  name: string;
  desc: string;
}

// 天赋信息
export interface CharacterTalentsModel {
  type: string;
  name: string;
  intro: string;
  detail: {
    name: string;
    data: string[];
  }[];
}
