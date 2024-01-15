<script setup>
import { onMounted, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { databaseClient } from '../services/db.service';
import TimeslotComponent from '../components/TimeslotComponent.vue';

const route = useRoute();

const state = reactive({
  editedItem: {
    selected: [],
  },
  editedTimeslot: {},
  editedArea: {},
  show_dialog: false,
  show_area_dialog: false,
  show_employee_list: false,
  events: [],
  employees: [],
  selectedShop: null,
  selectedEvent: null,
  selectedAreaName: null,
});

onMounted(async () => {
  const shop = await databaseClient.fetchShop(route.params.id);
  state.selectedShop = { ...shop, label: shop.name, value: shop.name };
  const events = (await databaseClient.fetchEvents()).map((event) => {
    return { ...event, label: event.name, value: event.name };
  });
  state.selectedEvent = events.at(-1);
  state.events = events;
  state.employees = await databaseClient.fetchEmployees();
});

const areas = computed(() => {
  return state.selectedShop?.areas?.filter(
    (area) => area.event_id === state.selectedEvent?.id
  );
});

const selectedArea = computed(() => {
  return areas.value?.find((area) => area.name === state.selectedAreaName);
});

function close() {
  state.editedTimeslot = {};
  state.show_dialog = false;
  state.editedArea = {};
  state.show_area_dialog = false;
}

async function addTimeslot() {
  const timeslotCreated = await databaseClient.createTimeslot({
    ...state.editedTimeslot,
    area_id: selectedArea.value.id,
  });
  if (timeslotCreated) {
    selectedArea.value.timeslots.push(timeslotCreated);
  }
  close();
}

async function addArea() {
  const areaCreated = await databaseClient.createArea({
    ...state.editedArea,
    shop_id: state.selectedShop.id,
    event_id: state.selectedEvent.id,
  });
  if (areaCreated) {
    state.selectedShop.areas.push(areaCreated);
  }
  close();
}

async function updateShop() {
  const shop = await databaseClient.fetchShop(route.params.id);
  state.selectedShop = { ...shop, label: shop.name, value: shop.name };
}
</script>

<template>
  <q-page
    class="q-pa-md"
    style="display: block; margin-left: auto; margin-right: auto"
  >
    <div class="q-gutter-md">
      <q-select
        outlined
        v-model="state.selectedEvent"
        :options="state.events"
        label="Events"
      />
      <q-select
        outlined
        v-model="state.selectedShop"
        :options="[state.selectedShop]"
        label="Werkstatt"
      />

      <q-tabs
        v-model="state.selectedAreaName"
        no-caps
        class="bg-orange text-white shadow-2"
      >
        <q-tab
          v-for="area in areas"
          :key="area.id"
          :name="area.name"
          :label="area.name"
        />
      </q-tabs>
      <div
        v-if="state.selectedEvent && state.selectedShop"
        style="
          margin-left: auto;
          margin-right: auto;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: stretch;
          max-width: 1000px;
        "
      >
        <q-btn @click="state.show_area_dialog = true">Bereich hinzufügen</q-btn>
      </div>
      <div
        v-if="selectedArea"
        style="
          display: flex;
          flex-direction: row;
          margin-left: auto;
          margin-right: auto;
          align-items: stretch;
          justify-content: center;
          max-width: 1000px;
        "
      >
        <q-btn @click="state.show_dialog = true">Zeitslot hinzufügen</q-btn>
      </div>

      <div
        class="q-pa-md row items-start q-gutter-sm"
        style="
          display: grid;
          grid-template-columns: 30% 30% 30%;
          align-content: space-between;
          grid-gap: 15px;
          justify-content: center;
          align-content: center;
        "
      >
        <q-card
          v-bind:model-value="state.selectedEvent"
          v-for="day in state.selectedEvent?.dates"
          :key="day"
        >
          <q-card-section
            v-if="selectedArea?.timeslots.find((slot) => slot.day === day)"
            class="bg-primary text-black"
          >
            <div class="text-h5" style="text-align: center">{{ day }}</div>
          </q-card-section>
          <div
            v-bind:model-value="selectedArea"
            v-for="timeslot in selectedArea?.timeslots"
            :key="timeslot.id"
          >
            <TimeslotComponent
              v-if="timeslot && timeslot.day === day"
              :timeslot="timeslot"
              :employees="state.employees"
              @update-shop="updateShop"
            ></TimeslotComponent>
          </div>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="state.show_dialog" :position="'top'">
      <q-card class="my-card" flat bordered>
        <q-card-section>
          <div class="text-h6">Zeitslot hinzufügen</div>
        </q-card-section>

        <q-card-section>
          <div class="row">
            <q-input
              v-model="state.editedTimeslot.day"
              type="date"
              label="Tag"
            ></q-input>
            <q-input
              v-model="state.editedTimeslot.start_time"
              type="time"
              label="Startzeit"
            ></q-input>
            <q-input
              v-model="state.editedTimeslot.end_time"
              type="time"
              label="Endzeit"
            ></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Schließen" size="l" @click="close"></q-btn>
          <q-btn
            label="OK"
            color="primary"
            v-close-popup
            @click="addTimeslot"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="state.show_area_dialog" :position="'top'">
      <q-card class="my-card" flat bordered>
        <q-card-section>
          <div class="text-h6">Bereich hinzufügen</div>
        </q-card-section>

        <q-card-section>
          <div class="row">
            <q-input
              v-model="state.editedArea.name"
              type="texr"
              label="Name"
            ></q-input>
            <q-input
              v-model="state.editedTimeslot.description"
              type="text"
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
            @click="addArea"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
div {
  color: black;
}
.vuecal__event {
  cursor: pointer;
}

.vuecal__event-title {
  font-size: 1.2em;
  font-weight: bold;
  margin: 4px 0 8px;
}

.vuecal__event-time {
  display: inline-block;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.vuecal__event-content {
  font-style: italic;
}
</style>
