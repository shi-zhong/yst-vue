import { defineStore } from 'pinia';
import type { ArtifactSuitModel } from '@/components/Artifact';
import { ArtifactSuitGetAll } from '@/api/ArtifactSuit';
import { DeepClone } from '@/utils';

/**
 * 用于保存页面状态数据，例如选中的角色，当前的侧边栏路由等网络无关数据
 */

interface ArtifactStore {
  artifactSuits: Map<number, ArtifactSuitModel>;
  uuidMap: Map<number, number>;
}

const emptyArtifactSuit: ArtifactSuitModel = {
  id: 0,
  uuid: 0,
  name: '圣遗物',
  rarity: 1,
  slots: [
    {
      type: '生之花',
      name: '',
      describe: '',
      story: ''
    },
    {
      type: '死之羽',
      name: '',
      describe: '',
      story: ''
    },
    {
      type: '时之沙',
      name: '',
      describe: '',
      story: ''
    },
    {
      type: '空之杯',
      name: '',
      describe: '',
      story: ''
    },
    {
      type: '理之冠',
      name: '',
      describe: '',
      story: ''
    }
  ],
  effects: []
};

export const useArtifactStore = defineStore('artifact', {
  state: () =>
    ({
      artifactSuits: new Map(),
      uuidMap: new Map()
    } as ArtifactStore),
  getters: {
    ArtifactSuitById(state) {
      return (id: number) =>
        (state.artifactSuits.has(id)
          ? state.artifactSuits.get(id)!
          : DeepClone(emptyArtifactSuit)) as ArtifactSuitModel;
    },
    ArtifactSuitByUUId(state) {
      return (uuid: number) =>
        (state.uuidMap.has(uuid)
          ? state.artifactSuits.get(state.uuidMap.get(uuid)!)!
          : DeepClone(emptyArtifactSuit)) as ArtifactSuitModel;
    }
  },
  actions: {
    async GenerateArtifactSuits() {
      const suits = await ArtifactSuitGetAll();
      const map = new Map<number, ArtifactSuitModel>();
      const uuidmap = new Map<number, number>();
      if (suits.code === 20000) {
        suits.data.artifacts.map((i) => {
          map.set(i.id, i);
          uuidmap.set(i.uuid, i.id);
        });
      }
      this.$state.artifactSuits = map;
      this.$state.uuidMap = uuidmap;
    }
  }
});
