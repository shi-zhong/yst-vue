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

export const useArtifactStore = defineStore('artifact', {
  state: () =>
    ({
      artifactSuits: new Map(),
      uuidMapId: new Map()
    } as ArtifactStore),
  getters: {
    GetArtifactSuitById(state) {
      return (id: number) => state.artifactSuits.get(id);
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
