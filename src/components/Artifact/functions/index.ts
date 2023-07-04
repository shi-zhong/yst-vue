import { type ArtifactSuitModel } from '../interfaces';

import ArtifactPicture from '@/assets/artifacts/five/wanderers_troupe/wanderers_troupe_plume.png';

const ArtifactEffectSearch = (id: number): ArtifactSuitModel => {
  const artifact_list: ArtifactSuitModel[] = [
    {
      id: 1638,
      name: '流浪大地的乐团',
      raity: 5,
      solts: {
        FlowerOfLife: {
          imgUrl: '',
          name: '',
          describe: ''
        },
        PlumnOfDeath: {
          imgUrl: ArtifactPicture,
          name: '琴师的箭羽',
          describe: '青蓝色的箭羽,并未在漫长岁月中褪色破碎,似乎带来了落珠流水的琴声。'
        },
        SandsOfEon: {
          imgUrl: '',
          name: '',
          describe: ''
        },
        GobletOfEonothem: {
          imgUrl: '',
          name: '',
          describe: ''
        },
        CircletOfLogos: {
          imgUrl: '',
          name: '',
          describe: ''
        }
      },
      effects: [
        {
          limit: 2,
          describe: '元素精通提高80点。'
        },
        {
          limit: 4,
          describe: '装备该圣遗物套装的角色为法器、弓箭角色时,角色重击造成的伤害提高35%。'
        }
      ]
    }
  ];

  for (const artifact of artifact_list) {
    if (artifact.id == id) {
      return artifact;
    }
  }

  return {
    id: 0,
    name: '',
    raity: 1,
    solts: {
      FlowerOfLife: {
        imgUrl: '',
        name: '',
        describe: ''
      },
      PlumnOfDeath: {
        imgUrl: '',
        name: '',
        describe: ''
      },
      SandsOfEon: {
        imgUrl: '',
        name: '',
        describe: ''
      },
      GobletOfEonothem: {
        imgUrl: '',
        name: '',
        describe: ''
      },
      CircletOfLogos: {
        imgUrl: '',
        name: '',
        describe: ''
      }
    },
    effects: []
  };
};

export * from './artifact.attributes';
export * from './artifact';
export * from './artifact.type';

export { ArtifactEffectSearch };
