<script setup>
import { onMounted, reactive, ref } from 'vue';
import { databaseClient } from '../services/db.service';
import { useUserStore } from '../stores/user.js';

const userStore = useUserStore();
const user = userStore.user;
const isAdmin = ref(user?.role === 'Admin');
const state = reactive({
  show_dialog: false,
  editedId: -1,
  editedItem: {},
  persons: [],
  searchTerm: '',
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
      name: 'tel',
      label: 'Telefonnummer',
      align: 'left',
      field: (row) => row.tel,
    },
    {
      name: 'birthday',
      label: 'Geburtsdatum',
      align: 'left',
      field: (row) => row.birthday,
    },
    {
      name: 'gender',
      label: 'Geschlecht',
      align: 'left',
      field: (row) => row.gender,
    },
    {
      name: 'description',
      label: 'Beschreibung',
      align: 'left',
      field: (row) => row.description,
    },
    {
      name: 'note',
      label: 'Notiz',
      align: 'left',
      field: (row) => row.note,
    },
    {
      name: 'user_id',
      label: 'Benutzerkonto',
      align: 'left',
      field: (row) => row.user_id,
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
    await updatePerson(state.editedId, state.editedItem);
  } else {
    await createPerson(state.editedItem);
  }
  close();
}

function onUpdatePerson(item) {
  state.loading = true;
  state.show_dialog = true;
  state.editedItem = Object.assign({}, item);
  state.editedId = item.id;
}

function getPaginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
  return `${firstRowIndex}-${endRowIndex} von ${totalRowsNumber}`;
}

function close() {
  state.editedId = -1;
  state.editedItem = {};
  state.show_dialog = false;
  state.loading = false;
}

async function createPerson(person) {
  const personData = await databaseClient.addPerson(person);
  state.persons.push(personData);
  console.debug('Successfully created person.');
}

async function updatePerson(id, person) {
  const personData = await databaseClient.updatePerson(id, person);
  const index = state.persons.findIndex((person) => person.id === id);
  Object.assign(state.persons[index], personData);
  console.debug(`Successfully updated person with id: '${id}'`);
}

async function deletePerson(id) {
  const personDeleted = await databaseClient.deletePerson(id);
  if (personDeleted) {
    state.persons.splice(
      state.persons.findIndex((person) => person.id === id),
      1
    );
  }
}

onMounted(async () => {
  state.loading = true;
  state.persons = await databaseClient.getPersons();
  state.loading = false;
});
</script>

<template>
  <div class="q-pa-md">
    <q-card dense flat bordered style="max-width: 100%">
      <q-table
        title="Mitarbeiter"
        :rows="state.persons"
        :columns="state.columns"
        row-key="id"
        binary-state-sort
        class="styled-table"
        :no-data-label="'Keine Daten verfügbar.'"
        :loading-label="'Daten werden geladen...'"
        :no-results-label="'Die Suchabfrage ergab keine Treffer.'"
        :rows-per-page-label="'Zeilen pro Seite'"
        :pagination-label="getPaginationLabel"
        :filter="state.searchTerm"
        :loading="state.loading"
      >
        <template v-slot:top>
          <div class="text-h6 q-pb-md">Mitarbeiterübersicht</div>
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
              {{ props.row.first_name }}
              <!--             <q-popup-edit
              v-model="props.row.first_name"
              title="Vorname"
              buttons
              label-set="Speichern"
              label-cancel="Schließen"
              :set="true"
              @save="onUpdatePersonPopup(props.row)"
            >
              <q-input
                type="text"
                v-model="props.row.first_name"
                dense
                autofocus
              ></q-input>
            </q-popup-edit> -->
            </q-td>
            <q-td key="last_name" :props="props">
              {{ props.row.last_name }}
              <!--      <q-popup-edit
              v-model="props.row.last_name"
              title="Nachname"
              buttons
              label-set="Speichern"
              label-cancel="Schließen"
            >
              <q-input
                type="text"
                v-model="props.row.last_name"
                dense
                autofocus
              ></q-input>
            </q-popup-edit> -->
            </q-td>

            <q-td key="email" :props="props">
              {{ props.row.email }}
              <!--           <q-popup-edit
              v-model="props.row.email"
              title="E-Mail-Adresse"
              buttons
              label-set="Speichern"
              label-cancel="Schließen"
            >
              <q-input
                type="email"
                v-model="props.row.email"
                dense
                autofocus
              ></q-input>
            </q-popup-edit> -->
            </q-td>
            <q-td key="tel" :props="props">
              {{ props.row.tel }}
              <!--             <q-popup-edit
              v-model="props.row.tel"
              title="Telefonnummer"
              buttons
              label-set="Speichern"
              label-cancel="Schließen"
            >
              <q-input
                type="tel"
                v-model="props.row.tel"
                dense
                autofocus
              ></q-input>
            </q-popup-edit> -->
            </q-td>
            <q-td key="birthday" :props="props">
              {{ props.row.birthday }}
              <!--             <q-popup-edit
              v-model="props.row.birthday"
              title="Geburtstag"
              buttons
              label-set="Speichern"
              label-cancel="Schließen"
            >
              <q-input
                type="date"
                v-model="props.row.birthday"
                dense
                autofocus
              ></q-input>
            </q-popup-edit> -->
            </q-td>
            <q-td key="gender" :props="props">
              {{ props.row.gender }}
              <!--             <q-popup-edit
              v-model="props.row.gender"
              title="Geschlecht"
              buttons
              label-set="Speichern"
              label-cancel="Schließen"
            >
              <q-select
                type="gender"
                :options="['maennlich', 'weiblich']"
                v-model="props.row.gender"
                dense
                autofocus
              ></q-select>
            </q-popup-edit> -->
            </q-td>
            <q-td key="description" :props="props">
              {{ props.row.description }}
              <!--           <q-popup-edit
              v-model="props.row.description"
              title="Beschreibung"
              buttons
              label-set="Speichern"
              label-cancel="Schließen"
            >
              <q-input
                type="text"
                v-model="props.row.description"
                dense
                autofocus
              ></q-input>
            </q-popup-edit> -->
            </q-td>
            <q-td key="note" :props="props">
              {{ props.row.note }}
              <!--            <q-popup-edit
              v-model="props.row.note"
              title="Notiz"
              buttons
              label-set="Speichern"
              label-cancel="Schließen"
            >
              <q-input
                type="text"
                v-model="props.row.note"
                dense
                autofocus
              ></q-input>
            </q-popup-edit> -->
            </q-td>
            <q-td key="user_id" :props="props">
              {{ props.row.user_id ? 'Ja' : 'Nein' }}
            </q-td>
            <q-td key="actions" :props="props">
              <div class="q-pa-md q-gutter-sm">
                <q-btn
                  color="secondary"
                  icon="fa-solid fa-edit"
                  size="sm"
                  spread="true"
                  @click="onUpdatePerson(props.row)"
                ></q-btn>
                <q-btn
                  v-if="isAdmin"
                  color="red"
                  icon="fa-solid fa-trash"
                  size="sm"
                  @click="
                    deletePerson(
                      state.persons.find((person) => person.id === props.row.id)
                        .id
                    )
                  "
                ></q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="col-3">
        <q-card-section class="row">
          <q-btn
            flat
            outline
            dense
            color="primary"
            label="Mitarbeiter hinzufügen"
            @click="state.show_dialog = true"
          ></q-btn>
        </q-card-section>
      </div>
    </q-card>
  </div>

  <q-dialog v-model="state.show_dialog" @hide="close">
    <q-card class="q-pa-md q-gutter-md">
      <q-card-section>
        <div class="text-h6">Mitarbeiter</div>
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
            v-model="state.editedItem.tel"
            label="Telefonnummer"
          ></q-input>
          <q-input
            v-model="state.editedItem.birthday"
            label="Geburtstag"
            type="date"
          ></q-input>
          <q-select
            v-model="state.editedItem.gender"
            :options="['maennlich', 'weiblich']"
            label="Geschlecht"
          ></q-select>
          <q-input
            v-model="state.editedItem.description"
            type="textarea"
            label="Beschreibung"
          ></q-input>
          <q-input
            v-model="state.editedItem.note"
            label="Notiz"
            type="textarea"
          ></q-input>
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

<style lang="sass">
.q-card
  width: 100%
  max-width: 800px
</style>
