import { defineStore } from 'pinia';

export const useGlobal = defineStore('global', {
  state: () => ({
    loading: -1,
  }),
  getters: {

  },
  actions: {
   setLoading(loading: number) {
    this.loading = loading
   }
  }
});
