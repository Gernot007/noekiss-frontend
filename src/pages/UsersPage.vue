<script setup>
import { onMounted, reactive } from 'vue';
import { databaseClient } from '../services/db.service';

const state = reactive({
  users: [],
  loading: false,
  searchTerm: '',
  show_dialog: false,
  editedId: -1,
  editedItem: {},
  columns: [
    {
      name: 'first_name',
      label: 'Vorname',
      sortable: true,
      align: 'left',
      field: (row) => row.first_name,
    },
    {
      name: 'last_name',
      label: 'Nachname',
      sortable: true,
      align: 'left',
      field: (row) => row.last_name,
    },
    {
      name: 'email',
      label: 'E-Mail-Adresse',
      align: 'left',
      field: (row) => row.email,
    },
    {
      name: 'role',
      label: 'Rolle',
      align: 'left',
      field: (row) => row.role,
    },
    {
      name: 'created_at',
      label: 'Erstellt am',
      align: 'left',
      field: (row) => row.created_at,
    },
    {
      name: 'actions',
      label: 'Aktionen',
      field: 'actions',
      align: 'center',
    },
  ],
});

async function onAddRow() {
  if (state.editedId > -1) {
    await updateUser(state.editedId, state.editedItem);
  } else {
    await createUser(state.editedItem);
  }
  close();
}

async function createUser(user) {
  const userData = await databaseClient.createUser(user);
  state.users.push(userData);
}

async function deleteUser(id) {
  const userDeleted = await databaseClient.deleteUser(id);
  if (userDeleted) {
    state.users.splice(
      state.users.findIndex((user) => user.id === id),
      1
    );
  }
}

function close() {
  state.editedId = -1;
  state.editedItem = {};
  state.show_dialog = false;
  state.loading = false;
}

function getPaginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
  return `${firstRowIndex}-${endRowIndex} von ${totalRowsNumber}`;
}

onMounted(async () => {
  state.loading = true;
  state.users = await databaseClient.getUsers();
  state.loading = false;
});
</script>

<template>
  <div class="q-pa-md">
    <q-card dense flat bordered style="max-width: 100%">
      <q-table
        :loading="state.loading"
        title="Benutzer"
        :rows="state.users"
        :columns="state.columns"
        row-key="id"
        :no-data-label="'Keine Daten verfügbar.'"
        :loading-label="'Daten werden geladen...'"
        :no-results-label="'Die Suchabfrage ergab keine Treffer.'"
        :rows-per-page-label="'Zeilen pro Seite'"
        :pagination-label="getPaginationLabel"
        :filter="state.searchTerm"
        class="styled-table"
      >
        <template v-slot:top>
          <div class="text-h6 q-pb-md">Benutzerübersicht</div>
          <div style="width: 100%" class="row">
            <div class="col-3">
              <q-input
                dense
                debounce="400"
                color="primary"
                v-model="state.searchTerm"
                placeholder="Suche"
              >
                <template v-slot:before>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div></div
        ></template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="first_name" :props="props">
              {{ props.row.user_metadata.first_name }}
            </q-td>
            <q-td key="last_name" :props="props">
              {{ props.row.user_metadata.last_name }}
            </q-td>
            <q-td key="email" :props="props">
              {{ props.row.email }}
            </q-td>
            <q-td key="role" :props="props">
              {{ props.row.user_metadata.role }}
            </q-td>
            <q-td key="created_at" :props="props">
              {{ new Date(props.row.created_at).toLocaleString() }}
            </q-td>
            <q-td key="actions" :props="props">
              <div class="q-pa-md q-gutter-sm">
                <q-btn
                  color="red"
                  icon="fa-solid fa-trash"
                  size="sm"
                  @click="
                    deleteUser(
                      state.users.find((user) => user.id === props.row.id).id
                    )
                  "
                ></q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="col">
        <q-card-section class="row">
          <q-btn
            flat
            outline
            dense
            color="primary"
            label="Benutzer hinzufügen"
            @click="state.show_dialog = true"
          ></q-btn>
        </q-card-section>
      </div>
    </q-card>
  </div>

  <q-dialog v-model="state.show_dialog" @hide="close">
    <q-card class="q-pa-md q-gutter-md">
      <q-card-section>
        <div class="text-h6">Benutzer</div>
      </q-card-section>

      <q-card-section>
        <div style="max-width: 90%">
          <q-input
            v-model="state.editedItem.first_name"
            label="Vorname"
          ></q-input>
          <q-input
            v-model="state.editedItem.last_name"
            label="Nachname"
          ></q-input>
          <q-input
            v-model="state.editedItem.email"
            label="E-Mail-Adresse"
          ></q-input>
          <q-input
            type="password"
            v-model="state.editedItem.password"
            label="Passwort"
          ></q-input>
          <q-select
            :options="['Admin', 'Haupthelfer']"
            v-model="state.editedItem.role"
            label="Rolle"
          ></q-select>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn label="Schließen" size="l" @click="close"></q-btn>
        <q-btn
          label="OK"
          color="primary"
          v-close-popup
          @click="onAddRow"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="sass" scoped>
.q-card
  width: 100%
  max-width: 800px
</style>
