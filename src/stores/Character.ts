import { defineStore } from 'pinia';
import { list } from '@/pages/Character/temp';

import { type CharacterCardProps, type BasicCardProps } from '@/components/Cards/interface';

type c = CharacterCardProps & BasicCardProps & { avatar: string; id: number; name: string };

export const useCharacterStore = defineStore('character', {
  state: () => ({
    crtOption: 0,
    list: list as unknown as c[],
    team: [10, 12],
    active: 1,
  }),
  actions: {
    setOption(option: number) {
      this.crtOption = option;
    },
    setActive(active: number) {
      this.active = active;
    },
  }
});
