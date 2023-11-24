<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-3 text-white">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
        />

        <q-toolbar-title> NÖKISS </q-toolbar-title>

        <q-btn flat round dense icon="whatshot" />
        <q-btn flat round dense icon="" @click="logout">Logout</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above class="bg-primary">
      <q-list dark>
        <q-item-label header>Kategorien</q-item-label>
        <q-item
          clickable
          target="_blank"
          rel="noopener"
          @click="this.$router.push('/shops')"
        >
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Werkstätten</q-item-label>
            <q-item-label caption>Übersicht der Werkstätten</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          target="_blank"
          rel="noopener"
          href="https://github.quasar.dev"
        >
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>GitHub</q-item-label>
            <q-item-label caption>github.com/quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          target="_blank"
          rel="noopener"
          href="http://chat.quasar.dev"
        >
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>https://chat.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          target="_blank"
          rel="noopener"
          href="https://forum.quasar.dev"
        >
          <q-item-section avatar>
            <q-icon name="record_voice_over" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>https://forum.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          target="_blank"
          rel="noopener"
          href="https://twitter.quasar.dev"
        >
          <q-item-section avatar>
            <q-icon name="rss_feed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          target="_blank"
          rel="noopener"
          href="https://facebook.quasar.dev"
        >
          <q-item-section avatar>
            <q-icon name="public" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Facebook</q-item-label>
            <q-item-label caption>@QuasarFramework</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';

export default {
  name: 'MyLayout',

  setup() {
    const router = useRouter();
    const loading = ref(false);
    const leftDrawerOpen = ref(false);

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    async function logout() {
      try {
        loading.value = true;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        router.push('/');
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      logout,
    };
  },
};
</script>
