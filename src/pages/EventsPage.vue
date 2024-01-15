<template>
  <div id="q-app">
    <div class="q-pa-sm q-gutter-sm">
      <q-table
        title="Veranstaltungen"
        :rows="events"
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
                    <q-input v-model="editedItem.name" label="Name"></q-input>
                    <q-input v-model="editedItem.dates" label="Datum"></q-input>
                    <q-input
                      v-model="editedItem.description"
                      label="Beschreibung"
                      type="text"
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
          </div>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
              <q-popup-edit
                v-model="props.row.name"
                title="Name"
                buttons
                label-set="Speichern"
                label-cancel="Schließen"
              >
                <q-input
                  type="text"
                  v-model="props.row.name"
                  dense
                  autofocus
                ></q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="dates" :props="props">
              <br />
              <span v-for="day in props.row.dates" :key="day"
                >{{ day }}<br
              /></span>
              <br />
              <q-popup-edit
                v-model="props.row.dates"
                title="Datum"
                buttons
                label-set="Speichern"
                label-cancel="Schließen"
              >
                <q-date v-model="props.row.dates" range multiple />
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
                  type="date"
                  v-model="props.row.description"
                  dense
                  autofocus
                ></q-input>
              </q-popup-edit>
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
const events = ref([]);
const columns = [
  {
    name: 'name',
    label: 'Name',
    align: 'left',
    field: (row) => row.name,
  },
  {
    name: 'dates',
    label: 'Datum',
    sortable: true,
    align: 'left',
    field: (row) => row.dates,
  },
  {
    name: 'description',
    label: 'Beschreibung',
    align: 'left',
    field: (row) => row.description,
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

function close() {
  editedId.value = -1;
  editedItem.value = {};
  show_dialog.value = false;
  loading.value = false;
}

onMounted(async () => {
  events.value = await databaseClient.fetchEvents();
});
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 600px
</style>
