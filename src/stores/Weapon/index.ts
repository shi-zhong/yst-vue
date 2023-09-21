import { WeaponTypeGetAll } from '@/api';
import type { WeaponTypeModel } from '@/components/Weapon';
import { defineStore } from 'pinia';

/**
 * 用于保存页面状态数据，例如选中的角色，当前的侧边栏路由等网络无关数据
 */

interface WeaponStore {
  weaponTypes: Map<number, WeaponTypeModel>;
}

export const emptyWeaponTypes: WeaponTypeModel = {
  id: 0,
  uuid: 0,
  basic: {
    name: 'string',
    star: 5,
    type: 0,
    imgUrl: ''
  },
  describe: 'string',
  effect: {
    name: 'string',
    describe: 'string',
    $: [[0]]
  },
  data: {
    main: [0],
    sub: {
      key: 'ATKPercentage',
      start: 0,
      growth: 0
    }
  },
  story: ['string']
};

export const useWeaponStore = defineStore('weapon', {
  state: () =>
    ({
      weaponTypes: new Map()
    } as WeaponStore),
  getters: {
    WeaponTypeById(state) {
      return (id: number) =>
        (state.weaponTypes.has(id)
          ? state.weaponTypes.get(id)!
          : emptyWeaponTypes) as WeaponTypeModel;
    }
  },
  actions: {
    async GenerateWeaponTypes() {
      const types = await WeaponTypeGetAll();
      const map = new Map<number, WeaponTypeModel>();
      if (types.msg === 'OK') {
        types.data.weapons.map((i) => {
          map.set(i.id, i);
        });
      }
      this.$state.weaponTypes = map;
    }
  }
});
