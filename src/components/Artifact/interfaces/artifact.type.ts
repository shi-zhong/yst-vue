export enum ArtifactSoltChinese {
  FlowerOfLife = '生之花',
  PlumnOfDeath = '死之羽',
  SandsOfEon = '时之沙',
  GobletOfEonothem = '空之杯',
  CircletOfLogos = '理之冠',
}

export type ArtifactSolt = keyof typeof ArtifactSoltChinese;

export interface ArtifactSuitModel {
  id: number;
  name: string;
  raity: 1 | 2 | 3 | 4 | 5;
  solts: {
    [key in ArtifactSolt]: {
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
