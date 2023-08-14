import { type ArtifactSlot } from './index';

export interface ArtifactAttributesModel {
  main: {
    [key: string]: [number, number];
  };
  sub: {
    [key: string]: [number, number, number, number];
  };
}

export type ArtifactMainAttributes = {
  [key in ArtifactSlot]: string[];
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
