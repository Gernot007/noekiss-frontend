<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '../services/auth.service';
import { useUserStore } from '../stores/user.js';

const userStore = useUserStore();
const user = userStore.user;

onMounted(async () => {
  await userStore.getLoggedInUser();
  shopId.value = await getShopManager();
});

import { databaseClient } from '../services/db.service';

const isAdmin = ref(user?.role === 'Admin');

const isHaupthelfer = ref(user?.role === 'Haupthelfer');
const router = useRouter();

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const shopId = ref(null);

async function getShopManager() {
  const shopManager = await databaseClient.getShopManager();
  const shopManagerOfUser = shopManager.find(
    (shopManager) => shopManager.manager.user_id === user?.id
  );
  if (shopManagerOfUser) {
    return shopManagerOfUser.shop_id;
  }
  return null;
}
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
          <q-btn v-if="isAdmin" flat @click="this.$router.push('/admin')"
            >Einstellungen</q-btn
          >
          <q-btn flat round dense icon="person">
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <q-list style="min-width: 100px">
                    <q-item clickable @click="this.$router.push('/account')">
                      <q-item-section>Mein Account</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item
                      clickable
                      @click="
                        shopId
                          ? this.$router.push({
                              path: `/shops/` + shopId,
                              query: {
                                active_tab: 'overview',
                                active_job_tab: 'default',
                                event: '',
                              },
                            })
                          : this.$router.push('/shops/create')
                      "
                    >
                      <q-item-section>Meine Werkstatt</q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="column items-center">
                  <!--   <q-avatar size="72px">
                    <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
                  </q-avatar> -->
                  <q-list>
                    <q-item>
                      <q-item-section>
                        {{
                          user.first_name + ' ' + user.last_name
                        }}</q-item-section
                      >
                    </q-item>
                    <q-item>
                      <q-btn
                        color="primary"
                        label="Logout"
                        push
                        size="md"
                        v-close-popup
                        @click="logout(router)"
                      />
                    </q-item>
                  </q-list>
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
          @click="
            shopId
              ? this.$router.push({
                  path: `/shops/` + shopId,
                  query: {
                    active_tab: 'overview',
                    active_job_tab: 'default',
                    event: '',
                  },
                })
              : this.$router.push('/shops/create')
          "
        >
          <q-item-section avatar>
            <q-icon name="work" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Meine Werkstatt</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="isAdmin" clickable @click="this.$router.push('/users')">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Benutzer</q-item-label>
            <q-item-label caption>Übersicht aller Benutzer</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="isAdmin || isHaupthelfer"
          clickable
          @click="this.$router.push('/employees')"
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Mitarbeiter</q-item-label>
            <q-item-label caption>Übersicht aller Mitarbeiter</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="isAdmin" clickable @click="this.$router.push('/events')">
          <q-item-section avatar>
            <q-icon name="event" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Veranstaltungen</q-item-label>
            <q-item-label caption>Übersicht aller Veranstaltungen</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="isAdmin" clickable @click="this.$router.push('/shops')">
          <q-item-section avatar>
            <q-icon name="work" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Werkstätten</q-item-label>
            <q-item-label caption>Übersicht der Werkstätten</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="isAdmin" clickable @click="this.$router.push('/reports')">
          <q-item-section avatar>
            <q-icon name="book" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Berichte & Auswertungen</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
