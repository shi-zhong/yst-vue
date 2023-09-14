import { Transformer } from './tools';
import { getMapperApi } from '@/api/common';
import type { ArtifactSlots } from '@/components/Artifact';
import type { WeaponTypes } from '@/components/Weapon/interface';

type CharacterMap = {
  name: 'character';
};

type ArtifactMapToCode = {
  name: 'artifact';
  slot: ArtifactSlots;
};
type ArtifactMapToSlot = {
  name: 'artifact';
  code: number;
};

type WeaponMapToCode = {
  name: 'weapon';
  type: WeaponTypes;
};
type WeaponMapToType = {
  name: 'weapon';
  code: number;
};

export const TypeNameToBackendCode = await (async () => {
  const { data, msg } = await getMapperApi();

  if (msg !== 'OK') {
    throw new Error('Can not get mapper.');
  }

  // const character = Transformer(data.character);
  const artifact = Transformer(data.artifact.slots);
  const weapon = Transformer(data.weapon.types);

  function m(origin: CharacterMap): [number];
  function m(origin: ArtifactMapToSlot): [number, ArtifactSlots];
  function m(origin: ArtifactMapToCode): [number, number];
  function m(origin: WeaponMapToType): [number, WeaponTypes];
  function m(origin: WeaponMapToCode): [number, number];
  function m(
    origin: CharacterMap | ArtifactMapToSlot | ArtifactMapToCode | WeaponMapToType | WeaponMapToCode
  ) {
    if (origin.name === 'character') {
      return [data.character.base];
    } else if (origin.name === 'artifact') {
      if ((origin as ArtifactMapToCode).slot) {
        return [data.artifact.base, artifact((origin as ArtifactMapToCode).slot)];
      } else {
        return [data.artifact.base, artifact((origin as ArtifactMapToSlot).code)];
      }
    } else if (origin.name === 'weapon') {
      if ((origin as WeaponMapToCode).type) {
        return [data.weapon.base, weapon((origin as WeaponMapToCode).type)];
      } else {
        return [data.weapon.base, weapon((origin as WeaponMapToType).code)];
      }
    }
    return [0];
  }
  return m;
})();
