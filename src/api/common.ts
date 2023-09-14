import type { WeaponTypes } from '@/components/Weapon';
import { get } from './Request';
import { type ArtifactSlots } from '@/components/Artifact';

type Mapper = {
  character: {
    base: number;
  };
  artifact: {
    base: number;
    slots: Record<ArtifactSlots, number>;
  };
  weapon: {
    base: number;
    types: Record<WeaponTypes, number>;
  };
};

export const getMapperApi = () => get<Mapper>('/mapper');
