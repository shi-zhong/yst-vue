import { type ArtifactSlot } from './index';

export interface ArtifactInstanceModel {
  id: number;
  suit_id: number;
  slot: ArtifactSlot;
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
