import { Transformer } from '@/utils';
import type { ArtifactMainArrtibutes, ArtifactSlots, ArtifactSlotsChinese } from '../interface';

export const AttributeseTransform = Transformer({
  ATK: '攻击力',
  ATKPercentage: '攻击力',
  DEF: '防御力',
  DEFPercentage: '防御力',
  HP: '生命值',
  HPPercentage: '生命值',
  CRITRate: '暴击率',
  CRITDMG: '暴击伤害',
  ElementalMastery: '元素精通',
  EnergyRecharge: '元素充能效率',
  HealingBonus: '治疗加成',
  PhysicalDMGBonus: '物理伤害加成',
  PyroDMGBonus: '火元素伤害加成',
  HyDroDMGBonus: '水元素伤害加成',
  DendroDMGBonus: '草元素伤害加成',
  ElectroDMGBonus: '雷元素伤害加成',
  AnemoDMGBonus: '风元素伤害加成',
  CryoDMGBonus: '冰元素伤害加成',
  GeoDMGBonus: '岩元素伤加成'
} as const);

const ArtifactSlotMainAttributes = {
  FlowerOfLife: ['HP'],
  PlumnOfDeath: ['ATK'],
  SandsOfEon: [
    'ATKPercentage',
    'DEFPercentage',
    'HPPercentage',
    'ElementalMastery',
    'EnergyRecharge'
  ],
  GobletOfEonothem: [
    'ATKPercentage',
    'DEFPercentage',
    'HPPercentage',
    'ElementalMastery',
    'PhysicalDMGBonus',
    'PyroDMGBonus',
    'HyDroDMGBonus',
    'DendroDMGBonus',
    'ElectroDMGBonus',
    'AnemoDMGBonus',
    'CryoDMGBonus',
    'GeoDMGBonus'
  ],
  CircletOfLogos: [
    'ATKPercentage',
    'DEFPercentage',
    'HPPercentage',
    'ElementalMastery',
    'CRITRate',
    'CRITDMG',
    'HealingBonus'
  ]
};

/**
 * 查看主属性是否正确
 * @param slot
 * @param main
 * @returns
 */
export const ArtifactSlotMainAttributesCheck = (
  slot: ArtifactSlots,
  main: ArtifactMainArrtibutes
) => {
  return ArtifactSlotMainAttributes[slot].includes(main);
};

export const ArtifactSlotsNameTransform = Transformer<ArtifactSlots, ArtifactSlotsChinese>({
  FlowerOfLife: '生之花',
  PlumnOfDeath: '死之羽',
  SandsOfEon: '时之沙',
  GobletOfEonothem: '空之杯',
  CircletOfLogos: '理之冠'
} as const);
