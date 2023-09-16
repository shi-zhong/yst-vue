export type WeaponTypes = 'Sword' | 'Catalyst' | 'Claymore' | 'Bow' | 'Polearm';
export type WeaponTypesChinese = '单手剑' | '法器' | '双手剑' | '弓箭' | '长柄武器';

export type WeaponSubArrtibutes =
  | 'ATKPercentage'
  | 'DEFPercentage'
  | 'HPPercentage'
  | 'ElementalMastery'
  | 'EnergyRecharge'
  | 'PhysicalDMGBonus'
  | 'CRITRate'
  | 'CRITDMG'

export interface WeaponTypeModel {
  id: number;
  uuid: number;
  basic: {
    name: string;
    star: 1 | 2 | 3 | 4 | 5;
    type: number;
    imgurl: string;
  };
  describe: string;
  data: {
    main: number[];
    sub: {
      key: WeaponSubArrtibutes;
      start: number;
      growth: number;
    };
  };
  story: string[];
  effects: {
    name: string;
    describe: string;
    $: number[][];
  };
}

export interface WeaponsInstanceModel {
  id: number;
  type_id: number;
  lock: boolean;
  rank: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  lvl: 1 | 20 | 40 | 50 | 60 | 70 | 80 | 90;
  refine: 0 | 1 | 2 | 3 | 4 | 5;
}
