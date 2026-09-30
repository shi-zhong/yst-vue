import { Transformer, Between } from '@/utils';
import type { ArtifactSlotsCode, ArtifactSlotsChinese } from '@shi-zhong/genshin-ui';
import type { ArtifactMainArrtibutes } from '../interface';

const AttributesMapper = {
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
} as const;

export const AttributesTransform = Transformer<typeof AttributesMapper>(AttributesMapper);

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
  slot: ArtifactSlotsCode,
  main: ArtifactMainArrtibutes
) => {
  return ArtifactSlotMainAttributes[slot].includes(main);
};

export const ArtifactSlotsNameTransform = Transformer<
  Record<ArtifactSlotsCode, ArtifactSlotsChinese>
>({
  FlowerOfLife: '生之花',
  PlumnOfDeath: '死之羽',
  SandsOfEon: '时之沙',
  GobletOfEonothem: '空之杯',
  CircletOfLogos: '理之冠'
} as const);

const artifactList = [
  'FlowerOfLife',
  'PlumnOfDeath',
  'SandsOfEon',
  'GobletOfEonothem',
  'CircletOfLogos'
];

const artifactChineseList = ['生之花', '死之羽', '时之沙', '空之杯', '理之冠'];

export const ArtifactSlotsToUniformNumber = (
  type: number | ArtifactSlotsCode | ArtifactSlotsChinese
) => {
  let i = 0;
  if (typeof type === 'number') {
    i = Between(type, 0, 5);
  } else if (artifactList.includes(type)) {
    i = artifactList.indexOf(type);
  } else {
    i = artifactChineseList.indexOf(type);
  }

  return i;
};

export const ArtifactSlotsToCode = (type: number | ArtifactSlotsCode | ArtifactSlotsChinese) => {
  artifactList[ArtifactSlotsToUniformNumber(type)];
};

export const ArtifactSlotsToChinese = (type: number | ArtifactSlotsCode | ArtifactSlotsChinese) => {
  return artifactChineseList[ArtifactSlotsToUniformNumber(type)];
};

export const ArtifactImgFileName = (id: number, type: number | ArtifactSlotsCode | ArtifactSlotsChinese) => {
  return `${id.toString().padStart(3, '0')}_${ArtifactSlotsToUniformNumber(type)}.png`
}