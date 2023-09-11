import { mapper as Mapper } from '@/api/common';
import type { ArtifactSlots } from '@/components/Artifact';
import type { WeaponsTypes } from '@/components/Weapon';

type CharacterMap = {
  name: 'character';
};

type ArtifactMap = {
  name: 'artifact';
  slot: ArtifactSlots;
};

type WeaponMap = {
  name: 'weapon';
  type: WeaponsTypes;
};

export const mapper = await (async () => {
  const { data, msg } = await Mapper();

  const { character, artifact, weapon } = data;

  if (msg !== 'OK') {
    console.error('Can not get mapper.');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_origin: CharacterMap | ArtifactMap | WeaponMap) => [0];
  }

  return (origin: CharacterMap | ArtifactMap | WeaponMap) => {
    if (origin.name === 'character') {
      return [character.base];
    } else if (origin.name === 'artifact') {
      return [artifact.base, artifact[origin.slot]];
    } else if (origin.name === 'weapon') {
      return [weapon.base, weapon[origin.type]];
    }
    return [0];
  };
})();

export const fileExt = (filename: string) => {
  let ext = '';

  for (let i = filename.length - 1; i >= 0; i--) {
    ext = filename[i] + ext;
    if (filename[i] === '.') {
      break;
    }
  }
  return ext;
};
