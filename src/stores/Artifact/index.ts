import { defineStore } from 'pinia';
import type { ArtifactSuitModel } from '@/components/Artifact';
import { ArtifactSuitGetAll } from '@/api/ArtifactSuit';

/**
 * 用于保存页面状态数据，例如选中的角色，当前的侧边栏路由等网络无关数据
 */

interface ArtifactStore {
  artifactSuits: Map<number, ArtifactSuitModel>;
}

const emptyArtifactSuit: ArtifactSuitModel = {
  id: 0,
  uuid: 0,
  name: '圣遗物',
  rarity: 1,
  slots: {
    FlowerOfLife: {
      imgUrl: '',
      name: '圣遗物',
      describe: ''
    },
    PlumnOfDeath: {
      imgUrl: '',
      name: '圣遗物',
      describe: ''
    },
    SandsOfEon: {
      imgUrl: '',
      name: '圣遗物',
      describe: ''
    },
    GobletOfEonothem: {
      imgUrl: '',
      name: '圣遗物',
      describe: ''
    },
    CircletOfLogos: {
      imgUrl: '',
      name: '圣遗物',
      describe: ''
    }
  },
  effects: []
};

export const useArtifactStore = defineStore('artifact', {
  state: () =>
    ({
      artifactSuits: new Map()
    } as ArtifactStore),
  getters: {
    ArtifactSuitById(state) {
      return (id: number) =>
        (state.artifactSuits.has(id)
          ? state.artifactSuits.get(id)!
          : emptyArtifactSuit) as ArtifactSuitModel;
    }
  },
  actions: {
    async GenerateArtifactSuits() {
      const sutis = await ArtifactSuitGetAll();
      const map = new Map<number, ArtifactSuitModel>();
      if (sutis.msg === 'OK') {
        sutis.data.artifacts.map((i) => {
          map.set(i.id, i);
        });
      }
      this.$state.artifactSuits = map;
    }
  }
});
