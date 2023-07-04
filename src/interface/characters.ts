import { type ElementsChinese } from './elements';

// 每个角色实例的基本信息
export interface CharacterInstanceBasicModel extends CharacterBasicModel {
  id: number;
  character_id: number;
  lvl: number;
}

// 角色(共性)信息
export interface CharacterModel {
  id: number;
  basic: CharacterBasicModel;
  attribute: CharacterAttributeModel;
  lives: CharacterLivesModel;
  skills: CharacterSkillsModel;
}

// 角色基础信息
export interface CharacterBasicModel {
  name: string;
  element: ElementsChinese;
  avatar: string;
  rarity: 1 | 2 | 3 | 4 | 5;
}

// 角色属性信息(基础属性)
export interface CharacterAttributeModel {}

// 命之座信息
export interface CharacterLivesModel {}

// 天赋信息
export interface CharacterSkillsModel {}
