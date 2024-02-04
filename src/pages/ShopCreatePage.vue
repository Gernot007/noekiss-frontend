<script setup>
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { databaseClient } from '../services/db.service';
import { useUserStore } from '../stores/user.js';

const userStore = useUserStore();
const user = userStore.user;
const route = useRoute();
const router = useRouter();

const state = reactive({
  showAddShopDialog: false,
  editedItem: {},
});

async function createShop() {
  const shopData = await databaseClient.addShop({
    ...state.editedItem,
  });
  const person = await databaseClient.getPersonByUserId(user.id);
  await databaseClient.addShopManager(shopData.id, person.id);
  router.push(route.path.replace('create', shopData.id));
  state.showAddShopDialog = false;
}
</script>

<template>
  <div class="q-pa-md">
    <q-card v-if="!state.shopId" dense flat bordered style="max-width: 100%">
      <div class="col">
        <q-card-section class="row">
          <q-btn
            flat
            outline
            dense
            color="primary"
            label="Werkstatt hinzufügen"
            @click="state.showAddShopDialog = true"
          ></q-btn>
        </q-card-section>
      </div>
    </q-card>
  </div>
  <q-dialog v-model="state.showAddShopDialog" @hide="close">
    <q-card class="q-pa-md q-gutter-md">
      <q-card-section>
        <div class="text-h6">Werkstatt</div>
      </q-card-section>

      <q-card-section>
        <div style="max-width: 90%">
          <q-input
            v-model="state.editedItem.name"
            type="text"
            label="Name"
          ></q-input>
          <q-input
            v-model="state.editedItem.description"
            type="textarea"
            label="Beschreibung"
          ></q-input>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn label="Schließen" size="l" @click="close"></q-btn>
        <q-btn
          label="OK"
          color="primary"
          v-close-popup
          @click="createShop()"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
