<script setup>
import { onMounted, reactive } from 'vue';
import { databaseClient } from '../services/db.service';

const state = reactive({
  events: [],
  searchTerm: '',
  show_dialog: false,
  editedId: -1,
  editedItem: {},
  columns: [
    {
      name: 'name',
      label: 'Veranstaltung',
      align: 'left',
      field: (row) => row.name,
    },
    {
      name: 'description',
      label: 'Beschreibung',
      align: 'left',
      field: (row) => row.description,
    },
    {
      name: 'dates',
      label: 'Datum',
      align: 'left',
      field: (row) => row.date_ranges,
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
    await updateEvent(state.editedId, state.editedItem);
  } else {
    await createEvent(state.editedItem);
  }
  close();
}

async function createEvent(event) {
  const eventData = await databaseClient.addEvent({
    ...event,
    date_ranges: undefined,
  });

  const date_ranges_returned = [];

  if (event.date_ranges) {
    for (const date_range of event.date_ranges) {
      const data = await databaseClient.addDateRange({
        event_id: eventData.id,
        start_date: date_range.from,
        end_date: date_range.to,
      });
      date_ranges_returned.push(data);
    }
  }

  state.events.push({ ...eventData, date_ranges: date_ranges_returned });
}

async function deleteEvent(id) {
  const eventDeleted = await databaseClient.deleteEvent(id);
  if (eventDeleted) {
    state.events.splice(
      state.events.findIndex((event) => event.id === id),
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

function compareStartDates(elem1, elem2) {
  return Date.parse(elem1.start_date) - Date.parse(elem2.start_date);
}

function getPaginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
  return `${firstRowIndex}-${endRowIndex} von ${totalRowsNumber}`;
}

function getDate(dateString) {
  const date = new Date(dateString);
  return `${pad(date.getDate())}-${pad(
    date.getMonth() + 1
  )}-${date.getFullYear()}`;
}

function pad(num, size = 2) {
  num = num.toString();
  while (num.length < size) num = '0' + num;
  return num;
}

onMounted(async () => {
  state.loading = true;
  state.events = await databaseClient.getEvents();
  state.loading = false;
});
</script>

<template>
  <div class="q-pa-md">
    <q-card dense flat bordered style="max-width: 100%">
      <q-table
        title="Veranstaltung"
        :rows="state.events"
        :columns="state.columns"
        row-key="id"
        :no-data-label="'Keine Daten verfügbar.'"
        :loading-label="'Daten werden geladen...'"
        :no-results-label="'Die Suchabfrage ergab keine Treffer.'"
        :rows-per-page-label="'Zeilen pro Seite'"
        :pagination-label="getPaginationLabel"
        :filter="state.searchTerm"
        :loading="state.loading"
        class="styled-table"
      >
        <template v-slot:top>
          <div class="text-h6 q-pb-md">Veranstaltungsübersicht</div>
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
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="description" :props="props">
              {{ props.row.description }}
            </q-td>
            <q-td key="dates" :props="props">
              {{
                props.row.date_ranges
                  .sort(compareStartDates)
                  .map(
                    (date_range) =>
                      `${getDate(date_range.start_date)}-${getDate(
                        date_range.end_date
                      )}`
                  )
                  .join(', ')
              }}
            </q-td>
            <q-td key="actions" :props="props">
              <div class="q-pa-md q-gutter-sm">
                <q-btn
                  color="red"
                  icon="fa-solid fa-trash"
                  size="sm"
                  @click="
                    deleteEvent(
                      state.events.find((event) => event.id === props.row.id).id
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
            label="Veranstaltung hinzufügen"
            @click="state.show_dialog = true"
          ></q-btn>
        </q-card-section>
      </div>
    </q-card>
  </div>

  <q-dialog v-model="state.show_dialog" @hide="close">
    <q-card class="q-pa-md q-gutter-md">
      <q-card-section>
        <div class="text-h6">Veranstaltung</div>
      </q-card-section>
      <q-card-section>
        <div style="max-width: 90%">
          <q-input v-model="state.editedItem.name" label="Name"></q-input>
          <q-input
            v-model="state.editedItem.description"
            type="textarea"
            label="Beschreibung"
          ></q-input>
          <div class="q-pa-lg column items-center">
            <q-date
              v-model="state.editedItem.date_ranges"
              range
              multiple
              default-view="Months"
              :landscape="true"
              label="Datum"
            ></q-date>
          </div>
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
