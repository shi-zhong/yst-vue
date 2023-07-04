export const AttributesConvertToChineseMapper = {
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
  GeoDMGBonus: '岩元素伤加成',
};

export const ArtifactMainAttributes = {
  FlowerOfLife: ['HP'],
  PlumnOfDeath: ['ATK'],
  SandsOfEon: [
    'ATKPercentage',
    'DEFPercentage',
    'HPPercentage',
    'ElementalMastery',
    'EnergyRecharge',
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
    'GeoDMGBonus',
  ],
  CircletOfLogos: [
    'ATKPercentage',
    'DEFPercentage',
    'HPPercentage',
    'ElementalMastery',
    'CRITRate',
    'CRITDMG',
    'HealingBonus',
  ],
};

const subs = [
  'ATK',
  'ATKPercentage',
  'DEF',
  'DEFPercentage',
  'HP',
  'HPPercentage',
  'CRITRate',
  'CRITDMG',
  'ElementalMastery',
  'EnergyRecharge',
];

export const ArtifactAttributeShifts = {
  five: {
    main: {
      CRITRate: [4.7, 31.1],
      CRITDMG: [9.3, 62.2],

      ATKPercentage: [7.0, 46.6],
      DEFPercentage: [8.7, 58.3],
      HPPercentage: [7.0, 46.6],

      ATK: [47, 311],
      HP: [717, 4780],

      HealingBonus: [5.4, 35.9],
      ElementalMastery: [28, 187],
      EnergyRecharge: [7.8, 51.8],

      PyroDMGBonus: [7.0, 46.6],
      HyDroDMGBonus: [7.0, 46.6],
      DendroDMGBonus: [7.0, 46.6],
      ElectroDMGBonus: [7.0, 46.6],
      AnemoDMGBonus: [7.0, 46.6],
      CryoDMGBonus: [7.0, 46.6],
      GeoDMGBonus: [7.0, 46.6],

      PhysicalDMGBonus: [8.7, 58.3],
    },
    sub: {
      CRITRate: [2.72, 3.11, 3.5, 3.89],
      CRITDMG: [5.44, 6.22, 6.99, 7.77],

      ATKPercentage: [4.08, 4.66, 5.25, 5.83],
      DEFPercentage: [5.1, 5.83, 6.56, 7.29],
      HPPercentage: [4.08, 4.66, 5.25, 5.83],

      ATK: [13.62, 15.56, 17.51, 19.45],
      DEF: [16.2, 18.52, 20.83, 23.15],
      HP: [209.13, 239, 268.88, 298.75],
      ElementalMastery: [16.32, 18.65, 20.98, 23.31],
      EnergyRecharge: [4.53, 5.18, 5.83, 6.48],
    },
  },
  four: {
    main: {
      CRITRate: [4.2, 23.2],
      CRITDMG: [8.4, 46.4],

      ATKPercentage: [6.3, 34.8],
      DEFPercentage: [7.9, 43.5],
      HPPercentage: [6.3, 34.8],

      ATK: [42, 232],
      HP: [645, 3571],

      HealingBonus: [4.8, 26.8],
      ElementalMastery: [25, 139],
      EnergyRecharge: [7.0, 38.7],

      PyroDMGBonus: [6.3, 34.8],
      HyDroDMGBonus: [6.3, 34.8],
      DendroDMGBonus: [6.3, 34.8],
      ElectroDMGBonus: [6.3, 34.8],
      AnemoDMGBonus: [6.3, 34.8],
      CryoDMGBonus: [6.3, 34.8],
      GeoDMGBonus: [6.3, 34.8],
      PhysicalDMGBonus: [7.9, 43.5],
    },
    sub: {
      CRITRate: [2.2, 2.5, 2.8, 3.1],
      CRITDMG: [4.4, 5.0, 5.6, 6.2],

      ATKPercentage: [3.3, 3.7, 4.2, 4.7],
      DEFPercentage: [4.1, 4.7, 5.3, 5.8],
      HPPercentage: [3.3, 3.7, 4.2, 4.7],

      ATK: [11, 12, 14, 16],
      DEF: [13, 15, 17, 19],
      HP: [167, 191, 215, 239],
      ElementalMastery: [13, 15, 17, 19],
      EnergyRecharge: [3.6, 4.1, 4.7, 5.2],
    },
  },
};
