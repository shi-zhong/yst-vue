import { type ArtifactSlots } from './functions/artifact.type';

export { type ArtifactSlots };

export interface ArtifactAttributesModel {
  main: {
    [key: string]: [number, number];
  };
  sub: {
    [key: string]: [number, number, number, number];
  };
}

export type ArtifactMainAttributes = {
  [key in ArtifactSlots]: string[];
};

export type ArtifactLvlData = {
  [key in 'one' | 'two' | 'three' | 'four' | 'five']: ArtifactAttributesModel;
};

export interface ArtifactAttributesStaticModel {
  mains: ArtifactMainAttributes;
  subs: string[];
  maps: [string, string][];
  lvl_data: ArtifactLvlData;
}

export interface ArtifactInstanceModel {
  id: number;
  suit_id: number;
  slot: ArtifactSlots;
  main: {
    tag: string;
    value: number;
  };
  subs: {
    tag: string;
    value: number;
  }[];
  lvl: number;
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
