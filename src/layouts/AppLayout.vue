<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '../services/auth.service';
import { getCurrentUser } from '../services/auth.service';

export default {
  name: 'MyLayout',

  setup() {
    const user = ref(getCurrentUser());
    const isAdmin = ref(user.value?.user_metadata?.role === 'Administrator');
    const isHaupthelfer = ref(
      user.value?.user_metadata?.role === 'Haupthelfer'
    );
    const router = useRouter();

    const leftDrawerOpen = ref(false);

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    return {
      isAdmin,
      isHaupthelfer,
      user,
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

        <q-toolbar-title>
          <q-btn flat round dense @click="this.$router.push('/')">NÖKISS</q-btn>
        </q-toolbar-title>
        <div class="q-pa-md">
          <q-btn flat round dense icon="whatshot">
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <q-list style="min-width: 100px">
                    <q-item clickable @click="this.$router.push('/account')">
                      <q-item-section>Mein Account</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable>
                      <q-item-section>Meine Werkstatt</q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="column items-center">
                  <q-avatar size="72px">
                    <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
                  </q-avatar>

                  <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

                  <q-btn
                    color="primary"
                    label="Logout"
                    push
                    size="sm"
                    v-close-popup
                    @click="logout(router)"
                  />
                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above class="bg-primary">
      <q-list dark>
        <q-item-label header>Kategorien</q-item-label>

        <q-item
          v-if="isAdmin || isHaupthelfer"
          clickable
          target="_blank"
          rel="noopener"
          @click="this.$router.push('/events')"
        >
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Veranstaltungen</q-item-label>
            <q-item-label caption>Übersicht der Veranstaltungen</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-if="isAdmin || isHaupthelfer"
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
          v-if="isAdmin || isHaupthelfer"
          clickable
          target="_blank"
          rel="noopener"
          @click="this.$router.push('/employees')"
        >
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Mitarbeiter</q-item-label>
            <q-item-label caption>Übersicht der Mitarbeiter</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
