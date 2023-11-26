<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '../services/auth.service';

export default {
  name: 'MyLayout',

  setup() {
    const router = useRouter();

    const leftDrawerOpen = ref(false);

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    return {
      router,
      leftDrawerOpen,
      toggleLeftDrawer,
      logout,
    };
  },
};
</script>

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
        <q-btn flat round dense icon="" @click="logout(router)">Logout</q-btn>
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
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
