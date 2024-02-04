import { defineStore } from 'pinia';
import { databaseClient } from '../services/db.service';

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: {
      id: '',
      email: '',
      birthday: '',
      first_name: '',
      last_name: '',
      phone: '',
      role: '',
    },
  }),
  getters: {
    user: (state) => state.userData,
  },
  actions: {
    async getLoggedInUser() {
      try {
        const user = await databaseClient.getLoggedInUser();
        if (user) {
          this.userData = {
            id: user.id,
            email: user.email,
            ...user.user_metadata,
          };
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
});
