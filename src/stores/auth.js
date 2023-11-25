import { defineStore } from 'pinia';
import { supabase } from '../supabase';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    session: null,
    loading: false,
    error: null,
  }),
  getters: {
    getUser: (state) => {
      return state.session?.user;
    },
  },
  actions: {
    async getSession() {
      console.log('Got session');
      this.loading = true;
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        this.session = data.session;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async logout(router) {
      this.loading = true;
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        this.session = null;
        router.push('/login');
      } catch (error) {
        alert(error.message);
      } finally {
        this.loading = false;
      }
    },
    async signInWithPassword(email, password, router) {
      this.loading = true;
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) throw Error;
        this.getSession();
        router.push('/');
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async signUpNewUser(email, password, router) {
      this.loading = true;
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            emailRedirectTo: '',
          },
        });

        if (error) throw Error;
        alert('Check your email for the login link!');

        router.push('/login');
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
