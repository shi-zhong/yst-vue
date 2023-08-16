const WeaponsTypesE2C = {
  Sword: '单手剑',
  Catalyst: '法器',
  Claymore: '双手剑',
  Bow: '弓箭',
  Polearm: '长柄武器'
};

const WeaponsTypesC2E = {
  单手剑: 'Sword',
  法器: 'Catalyst',
  双手剑: 'Claymore',
  弓箭: 'Bow',
  长柄武器: 'Polearm'
};

export type WeaponsTypes = keyof typeof WeaponsTypesE2C;
export type WeaponsTypesChinese = keyof typeof WeaponsTypesC2E;

export const WeaponTypesToChinese = (k: WeaponsTypes) => WeaponsTypesE2C[k];
export const WeaponTypesToEnglish = (k: WeaponsTypesChinese) => WeaponsTypesC2E[k];
