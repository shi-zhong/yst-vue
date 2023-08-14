export enum ArtifactSlotChinese {
  FlowerOfLife = '生之花',
  PlumnOfDeath = '死之羽',
  SandsOfEon = '时之沙',
  GobletOfEonothem = '空之杯',
  CircletOfLogos = '理之冠',
}

export type ArtifactSlot = keyof typeof ArtifactSlotChinese;

export interface ArtifactSuitModel {
  id: number;
  name: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  slots: {
    [key in ArtifactSlot]: {
      name: string;
      imgUrl: string;
      describe: string;
    } | null;
  };
  effects: {
    limit: number;
    describe: string;
  }[];
}
