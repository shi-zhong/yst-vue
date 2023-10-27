import { defineStore } from 'pinia';
import { useStateMachine, type StateMachineReturnType } from '@/utils/hooks';
import { type ContentRightNames, type SidebarNames } from '@/pages/Character/interface';
import { list } from '@/pages/Character/temp';

import type { CharacterModel, CharacterInstanceBasicModel } from '@/interface/characters';

export const useCharacterLayoutStore = defineStore('character-layout', {
  state: () => ({
    select: -1,
    list: list as unknown as CharacterInstanceBasicModel[],
    clist: [],
    sidebarStack: [] as string[],
    cRight: '',
    team: [10, 12] as number[],
  }),
  getters: {
    sidebar(state) {
      return state.sidebarStack[state.sidebarStack.length - 1] || '';
    }
  },
  actions: {
    // 设置角色列表当前选中的id
    setSelect(select: number) {
      const index = this.list.findIndex((l) => l.id === select);
      if (index !== -1) {
        this.select = select;
      } else if (this.list.length && this.team) {
        this.select = this.list.find((l) => l.id === this.team[0])?.id || -1;
      } else {
        this.select = this.list.length ? this.list[0].id : -1;
      }
    },
    setInTeam(inTeam: number[]) {
      this.team = [...inTeam];
    },
    setRight(right: string) {
      this.cRight = right;
    },
    pushSidebar(sidebar: string) {
      this.sidebarStack.push(sidebar);
    },
    popSidebar() {
      this.sidebarStack.pop();
    }
  }
});
