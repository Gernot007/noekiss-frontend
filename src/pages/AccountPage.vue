<script setup>
import { useUserStore } from '../stores/user.js';

const userStore = useUserStore();
const user = userStore.user;
</script>

<template>
  <div class="q-pa-md" style="max-width: 600px">
    <q-list bordered padding class="rounded-borders text-primary">
      <q-item>
        <q-item-section>
          <q-item-label>Rolle</q-item-label>
          <q-item-label caption lines="1">{{ user.role }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item>
        <q-item-section>
          <q-item-label>Vorname</q-item-label>
          <q-item-label caption lines="1">{{ user.first_name }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item>
        <q-item-section>
          <q-item-label>Nachname</q-item-label>
          <q-item-label caption lines="1">{{ user.last_name }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item>
        <q-item-section>
          <q-item-label>E-Mail-Adresse</q-item-label>
          <q-item-label caption lines="1">{{ user.email }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<style scoped></style>
