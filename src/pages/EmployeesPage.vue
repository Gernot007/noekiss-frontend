<template>
  <div id="q-app">
    <div class="q-pa-sm q-gutter-sm">
      <q-table
        title="Mitarbeiter"
        :rows="employees"
        :columns="columns"
        row-key="name"
        binary-state-sort
        class="styled-table"
      >
        <template v-slot:top>
          <div class="q-pa-sm q-gutter-sm">
            <q-dialog v-model="show_dialog">
              <q-card class="my-card" flat bordered>
                <q-card-section>
                  <div class="text-h6">Mitarbeiter</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <q-input
                      v-model="editedItem.firstname"
                      label="Vorname"
                    ></q-input>
                    <q-input
                      v-model="editedItem.lastname"
                      label="Nachname"
                    ></q-input>
                    <q-input
                      v-model="editedItem.birthday"
                      label="Geburtstag"
                      type="date"
                    ></q-input>
                    <q-input
                      v-model="editedItem.gender"
                      label="Geschlecht"
                    ></q-input>
                    <q-input
                      v-model="editedItem.email"
                      label="E-Mail-Adresse"
                    ></q-input>
                    <q-input
                      v-model="editedItem.tel"
                      label="Telefonnummer"
                    ></q-input>
                    <q-input
                      v-model="editedItem.emergencyTel"
                      label="Notfall-Telefonnummer"
                    ></q-input>
                    <q-input
                      v-model="editedItem.description"
                      label="Beschreibung"
                    ></q-input>
                    <q-input v-model="editedItem.note" label="Notiz"></q-input>
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
          </div>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="firstname" :props="props">
              {{ props.row.firstname }}
              <q-popup-edit
                v-model="props.row.firstname"
                title="Vorname"
                buttons
                label-set="Speichern"
                label-cancel="Schließen"
              >
                <q-input
                  type="text"
                  v-model="props.row.firstname"
                  dense
                  autofocus
                ></q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="lastname" :props="props">
              {{ props.row.lastname }}
              <q-popup-edit
                v-model="props.row.lastname"
                title="Nachname"
                buttons
                label-set="Speichern"
                label-cancel="Schließen"
              >
                <q-input
                  type="text"
                  v-model="props.row.lastname"
                  dense
                  autofocus
                ></q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="birthday" :props="props">
              {{ props.row.birthday }}
              <q-popup-edit
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
              </q-popup-edit>
            </q-td>
            <q-td key="gender" :props="props">
              {{ props.row.gender }}
              <q-popup-edit
                v-model="props.row.gender"
                title="Geschlecht"
                buttons
                label-set="Speichern"
                label-cancel="Schließen"
              >
                <q-input
                  type="gender"
                  v-model="props.row.gender"
                  dense
                  autofocus
                ></q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="email" :props="props">
              {{ props.row.email }}
              <q-popup-edit
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
              </q-popup-edit>
            </q-td>
            <q-td key="tel" :props="props">
              {{ props.row.tel }}
              <q-popup-edit
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
              </q-popup-edit>
            </q-td>
            <q-td key="emergencyTel" :props="props">
              {{ props.row.emergencyTel }}
              <q-popup-edit
                v-model="props.row.emergencyTel"
                title="Notfallnummer"
                buttons
                label-set="Speichern"
                label-cancel="Schließen"
              >
                <q-input
                  type="text"
                  v-model="props.row.emergencyTel"
                  dense
                  autofocus
                ></q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="description" :props="props">
              {{ props.row.description }}
              <q-popup-edit
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
              </q-popup-edit>
            </q-td>
            <q-td key="note" :props="props">
              {{ props.row.note }}
              <q-popup-edit
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
              </q-popup-edit>
            </q-td>
            <q-td key="isRegistrated" :props="props">
              {{ props.row.isRegistrated }}
            </q-td>
            <q-td key="actions" :props="props">
              <div class="q-pa-md q-gutter-sm">
                <q-btn color="blue" icon="fa-solid fa-eye" size="sm"></q-btn>
                <q-btn
                  color="secondary"
                  icon="fa-solid fa-edit"
                  size="sm"
                  spread="true"
                ></q-btn>
                <q-btn color="red" icon="fa-solid fa-trash" size="sm"></q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="col-3">
        <q-btn
          flat
          outline
          dense
          color="primary"
          label="Mitarbeiter hinzufügen"
          @click="show_dialog = true"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { databaseClient } from '../services/db.service';

const show_dialog = ref(false);
const editedId = ref(-1);
const editedItem = ref({});
const employees = ref([]);
const columns = [
  {
    name: 'firstname',
    label: 'Vorname',
    align: 'left',
    field: (row) => row.firstname,
  },
  {
    name: 'lastname',
    label: 'Nachname',
    sortable: true,
    align: 'left',
    field: (row) => row.lastname,
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
    name: 'email',
    label: 'E-Mail-Adresse',
    align: 'left',
    field: (row) => row.email_address,
  },
  {
    name: 'tel',
    label: 'Telefonnummer',
    align: 'left',
    field: (row) => row.tel,
  },
  {
    name: 'emergencyTel',
    label: 'Notfall-Telefonnummer',
    align: 'left',
    field: (row) => row.emergencyTel,
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
    name: 'isRegistrated',
    label: 'Registriert',
    align: 'left',
    field: (row) => row.isRegistrated,
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
  },
];

async function onAddRow() {
  if (editedId.value > -1) {
    await updateShop(editedId.value, editedItem.value);
  } else {
    await createShop(editedItem.value);
  }
  close();
}

function onUpdateShop(item) {
  loading.value = true;
  show_dialog.value = true;
  editedItem.value = Object.assign({}, item);
  editedId.value = item.id;
}

function close() {
  editedId.value = -1;
  editedItem.value = {};
  show_dialog.value = false;
  loading.value = false;
}

onMounted(async () => {
  employees.value = await databaseClient.fetchEmployees();
});
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 600px
</style>
