import { type ArtifactSolt } from './index';

export interface ArtifactInstanceModel {
  id: number;
  suit_id: number;
  solt: ArtifactSolt;
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
