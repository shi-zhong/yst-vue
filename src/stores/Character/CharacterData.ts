import { defineStore } from 'pinia';
import { list } from '@/pages/Character/temp';

import { type CharacterCardProps, type BasicCardProps } from '@/components/Cards/interface';

type c = CharacterCardProps & BasicCardProps & { avatar: string; id: number; name: string };

export const useCharacterDataStore = defineStore('character', {
  state: () => ({
    list: list as unknown as c[],
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
