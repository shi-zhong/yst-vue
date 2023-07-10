import { defineStore } from 'pinia';
import { useStateMachine, type StateMachineReturnType } from '@/utils/hooks';
import { type ContentRightNames, type SidebarNames } from '@/pages/Character/interface';

/**
 * 用于保存页面状态数据，例如选中的角色，当前的侧边栏路由等网络无关数据
 */

interface CharacterState {
  cRight: ContentRightNames;
  team: number[];
  active: number;
  readonly sidebar: StateMachineReturnType<SidebarNames>;
}

export const useCharacterStateStore = defineStore('character-state', {
  state: () =>
    ({
      cRight: 'attr',
      team: [10, 12],
      active: 1,
      sidebar: useStateMachine<SidebarNames>(
        {
          folding: [
            {
              to: 'expand'
            },
            {
              to: 'life'
            },
            {
              to: 'story'
            },
            {
              to: 'talents'
            }
          ],
          expand: [{ to: 'filter' }, { condition: 'back', to: 'folding' }],
          filter: [{ condition: 'back', to: 'expand' }],
          life: [{ condition: 'back', to: 'folding' }],
          story: [{ condition: 'back', to: 'folding' }],
          talents: [{ condition: 'back', to: 'folding' }]
        },
        'folding'
      )
    } as CharacterState),
  getters: {
    sidebarCurrent: (state) => state.sidebar.state
  },
  actions: {
    setContentRight(cRight: ContentRightNames) {
      this.cRight = cRight;
    },
    setActive(active: number) {
      this.active = active;
    }
  }
});
