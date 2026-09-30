import type { ArtifactSlots, ArtifactSlotsChinese } from '@shi-zhong/genshin-ui';

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

export interface ArtifactSlotModel {
  name: string;
  type: ArtifactSlotsChinese;
  story: string;
  describe: string;
}

export interface ArtifactSuitModel {
  id: number;
  uuid: number;
  name: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  slots: ArtifactSlotModel[];
  effects: {
    limit: number;
    describe: string;
  }[];
}
