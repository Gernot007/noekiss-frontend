import { defineStore } from 'pinia';
import { supabase } from '../supabase';
import { ref } from 'vue';

export const useShopStore = defineStore({
  id: 'shop',
  state: () => ({
    shops: [],
    shop: null,
    loading: false,
    error: null,
  }),
  getters: {
    getShopsPerUser: (state) => {
      return (userId) => state.shops.find((manager) => manager.id === userId);
    },
  },
  actions: {
    async getShops() {
      this.shops = [];
      this.loading = true;
      try {
        const { data, error } = await supabase.from('shops').select();
        if (error) throw error;
        this.shops = data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async getShop(id) {
      this.shop = null;
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('shops')
          .select()
          .eq('id', id);
        if (error) throw error;
        this.shop = data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async createShop(shop) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('shops')
          .insert(shop)
          .select();
        if (error) throw error;
        this.shops.push(data[0]);
        console.debug('Successfully created shop');
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async deleteShop(id) {
      this.loading = true;
      try {
        if (confirm('Wollen Sie den Datensatz wirklich löschen?')) {
          const { error } = await supabase.from('shops').delete().eq('id', id);
          if (error) throw error;
          this.shops.splice(
            this.shops.findIndex((shop) => shop.id === id),
            1
          );
          console.debug(`Successfully deleted shop with id '${id}'`);
        }
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async updateShop(id, item) {
      this.loading = true;
      try {
        const { error } = await supabase
          .from('shops')
          .update(item)
          .eq('id', id)
          .select();
        if (error) throw error;
        const index = this.shops.findIndex((shop) => shop.id === id);
        const updatedItem = ref(this.shops[index]);
        updatedItem.value = Object.assign(this.shops[index], item);
        console.debug(`Successfully updated shop with id: '${id}'`);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});