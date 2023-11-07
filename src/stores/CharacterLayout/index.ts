import { defineStore } from 'pinia';

import type { CharacterInstanceBasicModel, CharacterModel } from '@/interface/characters';
import { Between, merge } from '@/utils';
import { CharacterTypeQuery, CharacterTypeUpdate } from '@/api/CharacterStatic';
import { Message } from '@/components';

export const useCharacterLayoutStore = defineStore('character-layout', {
  state: () => ({
    // layout部分
    select: -1,
    sidebarStack: [] as string[],
    cRight: '',

    // 选中了哪个技能，哪个命之座
    talent: -1,
    lives: -1,
    canModifyLives: false,
    livesExtraTalent: [0, 0, 0],

    // 已有角色列表，实例数据
    list: [] as unknown as CharacterInstanceBasicModel[],
    team: [] as number[],

    // 角色静态类数据
    clist: [] as CharacterModel[]
  }),
  getters: {
    sidebar(state) {
      return state.sidebarStack[state.sidebarStack.length - 1] || '';
    },
    character(state) {
      return (
        state.list.find((c) => c.id === state.select) ?? {
          id: -1,
          character_id: -1,
          lvl: 1,
          talents: [1, 1, 1],
          lives: 0
        }
      );
    },
    // 静态角色数据
    characterStatic(state) {
      const cIns = state.list.find((c) => c.id === state.select);

      if (!cIns) return;

      return state.clist.find((c) => c.id === cIns.character_id);
    },
    characterStaticByID(state) {
      return (id: number) => {
        return state.clist.find((c) => c.id === id);
      };
    }
  },
  actions: {
    // 设置角色列表当前选中的id
    setSelect(select: number) {
      const has = this.list.find((l) => l.id === select);
      if (has !== undefined) {
        return (this.select = has.id);
      } else if (this.list.length && this.team.length) {
        const ch2 = this.list.find((l) => l.id === this.team[0]);
        if (ch2 !== undefined) {
          return (this.select = ch2.id);
        }
      } else {
        this.select = this.list.length ? this.list[0].id : -1;
      }
    },
    setTalent(talent: number) {
      this.talent = talent;
    },
    setLives(lives: number) {
      this.lives = lives;
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
    },
    updateCurrentStainText(text: string) {
      // 全部使用引用类型，保持同一个引用，内部通过proxy更新，不知道是否会存在问题
      // 或许是react思维在作祟，从表现上看没问题
      const staticState = this.characterStatic;

      if (!staticState) return;

      if (this.cRight === 'lives' && this.lives !== -1) {
        staticState.lives[this.lives].desc = text;
      } else if (this.cRight === 'talents' && this.talent !== -1) {
        staticState.talents[this.talent].intro = text;
      }
    },
    updateEName(text: string) {
      // 全部使用引用类型，保持同一个引用，内部通过proxy更新，不知道是否会存在问题
      // 或许是react思维在作祟，从表现上看没问题
      const staticState = this.characterStatic;

      if (!staticState) return;

      staticState.basic.eName = text;
    },
    setTalentLevel(dire: boolean) {
      const ch = this.character;
      if (0 <= this.talent && this.talent <= 2) {
        ch.talents[this.talent] = Between(ch.talents[this.talent] + (dire ? 1 : -1), 1, 10);
      }
    },
    setActiveLives() {
      const ch = this.character;
      // ch start at 1, lives start at 0
      if (ch.lives <= this.lives) {
        // active
        ch.lives = this.lives + 1;
      } else {
        // close
        ch.lives = this.lives;
      }
    },
    async uploadCharacterStatic() {
      const find = this.clist.find((f) => f.id === 0);
      if (find === undefined) return;
      const { msg, data } = await CharacterTypeUpdate(find);
      Message.success(msg);
      find.id = data.id;
      this.character.character_id = data.id;
    },
    async rollbackCurrentStatic() {
      const ch = this.characterStatic;
      if (ch === undefined || ch.id === 0) return;
      const { msg, data } = await CharacterTypeQuery(ch.id);

      if (msg === 'OK') {
        const find = this.clist.find((f) => f.id === ch.id);

        if (find !== undefined && data.character_static[0]) {
          merge(find, data.character_static[0]);
        }
      }
    },
    async getAllCharacterStatic() {
      const { msg, data } = await CharacterTypeQuery();

      if (msg === 'OK') {
        this.clist = data.character_static;
      }
    }
  }
});

const breakthrough = {
  主角: 6,
  暴击率: [0, 4.8],
  暴击伤害: [0, 9.6],
  元素精通: [24, 28.8],
  攻击力1生命值1元素: [6, 7.2],
  物理伤害加成: [7.5, 0],
  防御力: [7.5, 0],
  元素充能效率: [6.67, 8.0]
};
