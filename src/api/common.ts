import type { WeaponsTypes } from '@/components/Weapon';
import { get } from './Request';
import { type ArtifactSlots } from '@/components/Artifact';

type Mapper = {
  character: {
    base: number;
  };
  artifact: {
    [key in ArtifactSlots | 'base']: number;
  };
  weapon: {
    [key in WeaponsTypes | 'base']: number;
  };
};

export const mapper = () => get<Mapper>('/mapper');
