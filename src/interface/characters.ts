import { type ElementsChinese } from './elements';

// 每个角色实例的基本信息
export interface CharacterInstanceBasicModel {
  id: number;
  character_id: number;
  lvl: number;
  talents: number[];
  lives: number;
}

export interface CharacterInstanceExpandModel extends CharacterInstanceBasicModel {
  name: string;
  star: 1 | 2 | 3 | 4 | 5;
  eName: string;
  element: '风' | '雷' | '水' | '火' | '冰' | '草' | '岩';
}

// 角色(共性)信息
export interface CharacterModel {
  id: number;
  uuid: number;
  basic: CharacterBasicModel;
  attribute: CharacterAttributeModel;
  talents: CharacterTalentsModel;
  lives: CharacterConstellationModel;
}

// 角色基础信息
export interface CharacterBasicModel {
  name: string;
  element: ElementsChinese;
  star: 1 | 2 | 3 | 4 | 5;
  birth: string;
  belong: string;
  weapon: number;
  life: string;
  honor: string;
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
// 角色属性信息(基础属性)
export interface CharacterAttributeModel {
  data: { [key in Levels]: [number, number, number] };
  breakthrouth: string;
  specialty: string;
}

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
