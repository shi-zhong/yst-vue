import { defineStore } from 'pinia';
import type { ArtifactSuitModel } from '@/components/Artifact';
import { ArtifactSuitGetAll } from '@/api/ArtifactSuit';

/**
 * 用于保存页面状态数据，例如选中的角色，当前的侧边栏路由等网络无关数据
 */

interface ArtifactStore {
  artifactSuits: Map<number, ArtifactSuitModel>;
  uuidMapId: Map<number, number>;
}

const emptyArtifactSuit: ArtifactSuitModel = {
  id: 0,
  name: '',
  rarity: 1,
  slots: {
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

export const useArtifactStore = defineStore('artifact', {
  state: () =>
    ({
      artifactSuits: new Map(),
      uuidMapId: new Map()
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
      const map2 = new Map<number, number>();

      if (sutis.msg === 'OK') {
        sutis.data.artifacts.map((i) => {
          map.set(i.artifact.id, i.artifact);
          map2.set(i.artifact.id, i.id);
        });
      }
      this.$state.artifactSuits = map;
      this.$state.uuidMapId = map2;
    }
  }
});
