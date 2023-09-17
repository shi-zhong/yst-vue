import { Transformer } from '@/utils/tools';
import type { WeaponTypes, WeaponTypesChinese } from '../interface';

export const WeaponTypesTransform = Transformer<Record<WeaponTypes, WeaponTypesChinese>>({
  Sword: '单手剑',
  Catalyst: '法器',
  Claymore: '双手剑',
  Bow: '弓箭',
  Polearm: '长柄武器'
} as const);

// 处理 Rank 和 等级 之间的映射
export const StarToMaxRank = (star: 1 | 2 | 3 | 4 | 5) => {
  if (star === 1 || star === 2) {
    return 4;
  } else {
    return 6;
  }
};

export const StarToMaxLevel = (star: 1 | 2 | 3 | 4 | 5) => {
  if (star === 1 || star === 2) {
    return 70;
  } else {
    return 90;
  }
};

const ranks = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
const levels = [1, 20, 20, 40, 40, 50, 50, 60, 60, 70, 70, 80, 80, 90];
/**
 * 等级和阶级不一致时，优先处理等级
 */
export const VerifyRankAndLevel = (
  rank: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  level: 1 | 20 | 40 | 50 | 60 | 70 | 80 | 90
) => {
  for (let i = 0; i < ranks.length; i++) {
    if (ranks[i] === rank && levels[i] === level) {
      return i;
    }
  }
  return levels.findIndex((i) => level === i);
};

export const RankFromVerify = (index: number) => ranks[index];
export const LevelFromVerify = (index: number) => levels[index];
