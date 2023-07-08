import { defineStore } from 'pinia';
import { useStack, type useStackReturn } from '@/utils/hooks';
import { type ContentRightNames, type SidebarNames } from '@/pages/Character/interface';

/**
 * 用于保存页面状态数据，例如选中的角色，当前的侧边栏路由等网络无关数据
 */

interface CharacterState {
  cRight: ContentRightNames;
  team: number[];
  active: number;
  readonly sidebar: useStackReturn<SidebarNames>;
}

export const useCharacterStateStore = defineStore('character-state', {
  state: () =>
    ({
      cRight: 'attr',
      team: [10, 12],
      active: 1,
      sidebar: useStack<SidebarNames>(['folding'])
    } as CharacterState),
  actions: {
    setContentRight(cRight: ContentRightNames) {
      this.cRight = cRight;
    },
    setActive(active: number) {
      this.active = active;
    }
  }
});
