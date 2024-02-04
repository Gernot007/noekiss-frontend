import { defineStore } from 'pinia';

export const useShopSelectionStore = defineStore('shopSelection', {
  state: () => ({
    topLevelTab: 'overview',
    viewTab: 'default',
    event: '',
  }),
  getters: {},
  actions: {},
});
