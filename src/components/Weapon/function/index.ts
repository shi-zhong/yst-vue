import { Transformer } from '@/utils/tools';
import type { WeaponTypes, WeaponTypesChinese } from '../interface';

// 放在函数外，减少创建开销
export const WeaponTypesTransform = Transformer<WeaponTypes, WeaponTypesChinese>({
  Sword: '单手剑',
  Catalyst: '法器',
  Claymore: '双手剑',
  Bow: '弓箭',
  Polearm: '长柄武器'
} as const);
