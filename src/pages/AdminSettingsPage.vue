<script setup>
import { onMounted, reactive } from 'vue';
import { databaseClient } from '../services/db.service';

const state = reactive({
  settings: {},
});

onMounted(async () => {
  state.settings = await databaseClient.getSettings();
});
</script>

<template>
  <div class="q-pa-md" style="max-width: 600px">
    <q-list bordered padding class="rounded-borders text-primary">
      <q-item>
        <q-item-section>
          <q-item-label>Registrierungscode - Administrator</q-item-label>
          <q-item-label class="text-h6" caption lines="1">{{
            state.settings.registration_code_admin
          }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item>
        <q-item-section>
          <q-item-label>Registrierungscode - Haupthelfer</q-item-label>
          <q-item-label caption lines="1">{{
            state.settings.registration_code_haupthelfer
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<style scoped></style>
