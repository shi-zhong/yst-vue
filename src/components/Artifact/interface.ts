export type ArtifactSlots =
  | 'FlowerOfLife'
  | 'PlumnOfDeath'
  | 'SandsOfEon'
  | 'GobletOfEonothem'
  | 'CircletOfLogos';

export type ArtifactSlotsChinese = '生之花' | '死之羽' | '时之沙' | '空之杯' | '理之冠';

export type ArtifactMainAttributes = {
  [key in ArtifactSlots]: ArtifactMainArrtibutes[];
};

export type ArtifactMainArrtibutes =
  | 'HP'
  | 'ATK'
  | 'ATKPercentage'
  | 'DEFPercentage'
  | 'HPPercentage'
  | 'ElementalMastery'
  | 'EnergyRecharge'
  | 'PhysicalDMGBonus'
  | 'PyroDMGBonus'
  | 'HyDroDMGBonus'
  | 'DendroDMGBonus'
  | 'ElectroDMGBonus'
  | 'AnemoDMGBonus'
  | 'CryoDMGBonus'
  | 'GeoDMGBonus'
  | 'CRITRate'
  | 'CRITDMG'
  | 'HealingBonus';

export type ArtifactSubArrtibutes =
  | 'ATK'
  | 'ATKPercentage'
  | 'DEF'
  | 'DEFPercentage'
  | 'HP'
  | 'HPPercentage'
  | 'CRITRate'
  | 'CRITDMG'
  | 'ElementalMastery'
  | 'EnergyRecharge';

export interface ArtifactInstanceModel {
  id: number;
  suit: number;
  rarity: number;
  slot: number;
  data: {
    main: {
      key: ArtifactMainArrtibutes;
      value: number;
    };
    subs: {
      key: ArtifactSubArrtibutes;
      value: number;
    }[];
  };
  lock: boolean;
}

export interface ArtifactSuitModel {
  id: number;
  name: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  slots: {
    [key in ArtifactSlots]: {
      name: string;
      imgUrl: string;
      describe: string;
    };
  };
  effects: {
    limit: number;
    describe: string;
  }[];
}
