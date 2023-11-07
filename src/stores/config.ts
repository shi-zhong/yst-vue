import { defineStore } from 'pinia';
import { Cookie, requestConfig } from '@/api';
import { Message } from '@/components';
import { Transformer } from '@/utils';

export const useConfig = defineStore('config', {
  state: () => ({
    character: {
      base: -1,
      baseUrl: 'characters'
    },
    artifact: {
      base: -1,
      baseUrl: 'artifacts',
      slots: {
        FlowerOfLife: -1,
        PlumnOfDeath: -1,
        SandsOfEon: -1,
        GobletOfEonothem: -1,
        CircletOfLogos: -1
      }
    },
    weapon: {
      base: -1,
      baseUrl: 'weapons',
      types: {
        Sword: -1,
        Catalyst: -1,
        Claymore: -1,
        Bow: -1,
        Polearm: -1
      }
    }
  }),
  getters: {
    characterCode(state) {
      return state.character.base;
    },
    artifactCode(state) {
      return state.artifact.base;
    },
    weaponCode(state) {
      return state.weapon.base;
    },
    artifactTypeCode(state) {
      return Transformer(state.artifact.slots);
    },
    weaponTypeCode(state) {
      return Transformer(state.weapon.types);
    },
    artifactImage(state) {
      return (url: string) => `${state.artifact.baseUrl}/${url}`;
    },
    weaponImage(state) {
      return (url: string) => `${state.weapon.baseUrl}/${url}`;
    },
    CharacterImage(state) {
      return (url: string) => `${state.character.baseUrl}/${url}`
    }
  },
  actions: {
    async RequestConfig() {
      const { data, msg } = await requestConfig();

      if (msg !== 'OK') {
        // load from cache
        const cache = Cookie.get('config');
        if (cache === '') Message.error('获取 Config 失败!');
        else this.$state = { ...JSON.parse(cache) };
        return;
      }

      Cookie.set('config', JSON.stringify(data));

      this.$state = { ...data };
    }
  }
});
