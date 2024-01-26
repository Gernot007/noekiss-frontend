<script setup>
import { onMounted, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { databaseClient } from '../services/db.service';
import TimeslotComponent from '../components/TimeslotComponent.vue';

const route = useRoute();

const state = reactive({
  show_dialog: false,
  editedId: -1,
  editedItem: {},
  events: [],
  selectedEvent: '',
  selectedArea: {},
  selectedAreaEvent: null,
  active_tab: 'default',
});

onMounted(async () => {
  state.selectedArea = await databaseClient.getShop(route.params.id);
  state.events = (await databaseClient.getEvents()).map((event) => {
    return {
      ...event,
      label: event.name,
    };
  });
  state.selectedEvent = state.events.at(-1);
  state.selectedAreaEvent = await databaseClient.getShopEventByIds(
    route.params.id,
    state.selectedEvent.id
  );
});

async function addShopEvent() {
  if (
    confirm(
      `Der Bereich ${state.selectedArea.name} wird einmalig der Veranstaltung ${state.selectedEvent.name} zugewiesen.`
    )
  ) {
    const isParentAdded = (await databaseClient.getShopEventByIds(
      route.params.parent_id,
      state.selectedEvent.id
    ))
      ? true
      : false;

    if (!isParentAdded) {
      state.selectedAreaEvent = await databaseClient.addShopEvent(
        route.params.parent_id,
        state.selectedEvent.id
      );
    }

    state.selectedAreaEvent = await databaseClient.addShopEvent(
      state.selectedArea.id,
      state.selectedEvent.id
    );
  }
}
</script>

<template>
  <div class="q-pa-md">
    <div class="q-pb-md">
      <q-card dense flat bordered style="max-width: 100%">
        <div class="col">
          <q-card-section class="row">
            <div class="text-h6">{{ state.selectedArea.name }}</div>
          </q-card-section>
          <q-card-section class="row" v-if="state.selectedArea.description">
            <div class="text-subtitle1">
              {{ state.selectedArea.description }}
            </div>
          </q-card-section>
        </div>
      </q-card>
    </div>
    <div class="q-pb-md">
      <q-select
        outlined
        v-model="state.selectedEvent"
        :options="state.events"
        label="Event"
        class="bg-white"
      />
    </div>
    <div v-if="state.selectedAreaEvent">
      <div class="q-pb-md">
        <q-tabs
          v-model="state.active_tab"
          narrow-indicator
          class="bg-orange text-white shadow-2"
        >
          <q-tab name="default" label="Standard" />
          <q-tab name="detail" label="Detail" />
        </q-tabs>
      </div>
      <div v-if="state.active_tab === 'default'">
        <q-card dense flat bordered style="max-width: 100%">
          <div class="col">
            <q-card-section class="row">
              <q-btn
                flat
                outline
                dense
                color="primary"
                label="Mitarbeiter einteilen"
                @click="state.show_dialog = true"
              ></q-btn>
            </q-card-section>
          </div>
        </q-card>
      </div>
    </div>
    <div v-else>
      <div v-if="state.active_tab === 'default'">
        <q-card dense flat bordered style="max-width: 100%">
          <div class="col">
            <q-card-section class="row">
              <q-btn
                flat
                outline
                dense
                color="primary"
                label="Bereich der Veranstaltung zuweisen"
                @click="addShopEvent"
              ></q-btn>
            </q-card-section>
          </div>
        </q-card>
      </div>
    </div>
  </div>
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
