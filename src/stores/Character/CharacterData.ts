import { defineStore } from 'pinia';
import { list } from '@/pages/Character/temp';

import type { CharacterModel, CharacterInstanceBasicModel } from '@/interface/characters';

export const useCharacterDataStore = defineStore('character', {
  state: () => ({
    list: list as unknown as CharacterInstanceBasicModel[],
    clist: [] as CharacterModel[],
    filter: {
      element: [] as string[],
      weapon: [] as string[]
    }
  }),
  actions: {
    setFilter(filter: { element: string[]; weapon: string[] }) {
      this.filter = filter;
    }
  }
});
