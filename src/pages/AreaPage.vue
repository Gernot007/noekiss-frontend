<script setup>
import { computed, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import TimeslotComponent from '../components/TimeslotComponent.vue';
import { databaseClient } from '../services/db.service';
import { useUserStore } from '../stores/user.js';

const userStore = useUserStore();
const user = userStore.user;
const route = useRoute();

const state = reactive({
  loading: true,
  show_dialog: false,
  editedId: -1,
  editedItem: {},
  subShops: [],
  showSubShopDialog: false,
  showAddEmployeeDialog: false,
  showHaupthelferDialog: false,
  subShopsColumns: [
    {
      name: 'name',
      label: 'Name',
      sortable: true,
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
      name: 'actions',
      label: 'Aktionen',
      field: 'actions',
      align: 'center',
    },
  ],
  personColumns: [
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
      name: 'actions',
      label: 'Aktionen',
      field: 'actions',
      align: 'center',
    },
  ],
  employeesColumns: [
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
      name: 'actions',
      label: 'Aktionen',
      field: 'actions',
      align: 'center',
    },
  ],
  haupthelferColumns: [
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
      name: 'actions',
      label: 'Aktionen',
      field: 'actions',
      align: 'center',
    },
  ],
  selectedShop: {},
  selectedEvent: {},
  selectedShopEvent: null,
  events: [],
  active_tab: 'overview',
  active_job_tab: 'default',
  persons: [],
  allEmployees: [],
  allShopEvents: [],
  employees: [],
  selectedEmployees: [],
  haupthelfer: [],
  searchTerm: '',
  employeeWasAssignedLastYear: false,
  showAddTimeslotDialog: false,
  editedTimeslot: {
    date: '2024/02/01',
    start_time: '09:30',
    end_time: '13:30',
  },
});

onMounted(async () => {
  state.selectedShop = await databaseClient.getShop(route.params.id);
  state.events = (await databaseClient.getEvents()).map((event) => {
    return {
      ...event,
      label: event.name,
    };
  });
  state.selectedEvent = state.events.at(-1);
  state.subShops = await databaseClient.getSubShops(state.selectedShop.id);

  for (const event of state.events) {
    const shopEvent = await databaseClient.getShopEventByIds(
      route.params.id,
      event.id
    );

    if (shopEvent) {
      state.allShopEvents.push(shopEvent);
    }
  }

  state.persons = await databaseClient.getPersons();
  state.haupthelfer = await databaseClient.getManagersOfShop(route.params.id);
  state.loading = false;
});

state.hasEditPermission = computed(() => {
  const isOwner = state.haupthelfer.find((hautph) => hautph.user_id === user.id)
    ? true
    : false;

  const isAdmin = user?.role === 'Admin';
  if (isAdmin | isOwner) return true;
  return false;
});

state.selectedShopEvent = computed(() => {
  return state.allShopEvents.find(
    (shopEvent) => state.selectedEvent.id === shopEvent.event_id
  );
});

state.allTimeslotDates = computed(() => {
  return [
    ...new Set(
      state.selectedShopEvent.timeslots?.map((timeslot) => timeslot.date)
    ),
  ];
});

async function onAddRow() {
  if (state.editedId > -1) {
    await updateSubShop(state.editedId, state.editedItem);
  } else {
    await createSubShop(state.editedItem);
  }
  close();
}

async function refreshShops() {
  const shopEvent = await databaseClient.getShopEventById(
    state.selectedShopEvent.id
  );
  const index = state.allShopEvents.findIndex(
    (shopEvent) => shopEvent.id === state.selectedShopEvent.id
  );
  Object.assign(state.allShopEvents[index], shopEvent);
}

async function updateSubShop(id, shop) {
  const shopData = await databaseClient.updateShop(id, {
    ...shop,
    parent_id: state.selectedShop.id,
  });
  const index = state.subShops.findIndex((shop) => shop.id === id);
  Object.assign(state.subShops[index], shopData);
  console.debug(`Successfully updated shop with id: '${id}'`);
}

async function createSubShop(shop) {
  const shopData = await databaseClient.addShop({
    ...shop,
    parent_id: state.selectedShop.id,
  });
  state.subShops.push(shopData);
}

function close() {
  state.searchTerm = '';
  state.loading = false;
  state.editedItem = {};
  state.selectedEmployees = [];
  state.showHaupthelferDialog = false;
  state.showSubShopDialog = false;
  state.showAddEmployeeDialog = false;
  state.employeeWasAssignedLastYear = false;
  state.showAddTimeslotDialog = false;
  state.editedTimeslot = {
    date: '2024/02/01',
    start_time: '09:30',
    end_time: '13:30',
  };
}

async function addShopEvent() {
  if (
    confirm(
      `Die Werkstatt ${state.selectedShop.name} wird einmalig der Veranstaltung ${state.selectedEvent.name} zugewiesen.`
    )
  ) {
    const shopEvent = await databaseClient.addShopEvent(
      state.selectedShop.id,
      state.selectedEvent.id
    );
    state.allShopEvents.push(shopEvent);
    state.allEmployees.push({
      shopEventId: shopEvent.id,
      employees: [],
    });
  }
}

async function addEmployees() {
  for (const employee of state.selectedEmployees) {
    try {
      const data = await databaseClient.addEmployeeShop(
        employee.id,
        state.selectedShopEvent.id
      );
      state.selectedShopEvent.employees.push(data.person);
    } catch (error) {
      console.error(error);
    }
  }
  close();
}

async function addHaupthelfer() {
  for (const employee of state.selectedEmployees) {
    try {
      const data = await databaseClient.addShopManager(
        state.selectedShop.id,
        employee.id
      );
      state.haupthelfer.push(data.person);
    } catch (error) {
      console.error(error);
    }
  }
  close();
}

async function deleteHaupthelfer(person_id) {
  try {
    await databaseClient.deleteMangerFromShop(state.selectedShop.id, person_id);
    state.haupthelfer.splice(
      state.haupthelfer.findIndex(
        (haupthelfer) => haupthelfer.id === person_id
      ),
      1
    );
  } catch (error) {
    console.error(error);
  }
}

async function deleteEmployee(person_id) {
  try {
    await databaseClient.deleteEmployeeShop(
      person_id,
      state.selectedShopEvent.id
    );
    state.selectedShopEvent.employees.splice(
      state.selectedShopEvent.employees.findIndex(
        (employee) => employee.id === person_id
      ),
      1
    );
  } catch (error) {
    console.error(error);
  }
}

async function addTimeslot() {
  const data = await databaseClient.addTimeslot({
    ...state.editedTimeslot,
    shop_event_id: state.selectedShopEvent.id,
  });
  state.selectedShopEvent.timeslots.push(data);
  close();
}
</script>

<template>
  <div class="q-pa-md" v-if="!state.loading">
    <div class="q-pb-md">
      <q-tabs
        v-model="state.active_tab"
        narrow-indicator
        class="bg-purple-4 text-white shadow-2"
      >
        <q-tab name="overview" label="Übersicht" />
        <q-tab name="jobs" label="Dienste" />
      </q-tabs>
    </div>
    <div v-if="state.active_tab === 'overview'">
      <div class="q-pb-md">
        <q-card dense flat bordered style="max-width: 100%">
          <div class="col">
            <q-card-section class="row">
              <div class="text-h6">{{ state.selectedShop.name }}</div>
            </q-card-section>
            <q-card-section class="row" v-if="state.selectedShop.description">
              <div class="text-subtitle1">
                {{ state.selectedShop.description }}
              </div>
            </q-card-section>
            <q-card-section class="row" v-if="state.selectedShop.haupthelfer">
              <div class="text-subtitle1">
                {{ state.selectedShop.haupthelfer }}
              </div>
            </q-card-section>
          </div>
        </q-card>
      </div>

      <div class="q-pb-md">
        <q-card dense flat bordered style="max-width: 100%">
          <q-table
            v-if="state.haupthelfer.length > 0"
            flat
            bordered
            :rows="state.haupthelfer"
            :columns="state.haupthelferColumns"
            row-key="id"
            hide-pagination
          >
            <template v-slot:top>
              <div class="text-h6 q-pb-md">Verantwortliche</div>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="first_name" :props="props">
                  {{ props.row.first_name }}
                </q-td>
                <q-td key="last_name" :props="props">
                  {{ props.row.last_name }}
                </q-td>
                <q-td key="actions" :props="props">
                  <div class="q-pa-md q-gutter-sm">
                    <q-btn
                      v-if="state.hasEditPermission"
                      color="red"
                      icon="fa-solid fa-trash"
                      size="sm"
                      @click="deleteHaupthelfer(props.row.id)"
                    ></q-btn>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <div class="col">
            <q-card-section class="row">
              <q-btn
                v-if="state.hasEditPermission"
                flat
                outline
                dense
                color="primary"
                label="Verantwortlichen hinzufügen"
                @click="state.showHaupthelferDialog = true"
              ></q-btn>
            </q-card-section>
          </div>
        </q-card>
      </div>

      <!-- <div class="q-pb-md">
        <q-card dense flat bordered style="max-width: 100%">
          <q-table
            v-if="state.subShops.length > 0"
            flat
            bordered
            class="styled-table"
            :rows="state.subShops"
            :columns="state.subShopsColumns"
            row-key="id"
            :filter="filter"
            hide-pagination
          >
            <template v-slot:top>
              <div class="text-h6 q-pb-md">Bereiche</div>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props" class="cursor-pointer">
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <q-td key="description" :props="props">
                  {{ props.row.description }}
                </q-td>
                <q-td key="actions" :props="props">
                  <div class="q-pa-md q-gutter-sm">
                    <q-btn
                      color="blue"
                      icon="fa-solid fa-eye"
                      size="sm"
                      spread="true"
                      @click="
                        this.$router.push(
                          `/shops/${state.selectedShop.id}/areas/${props.row.id}`
                        )
                      "
                    ></q-btn>
                    <q-btn
                      v-if="state.hasEditPermission"
                      color="orange"
                      icon="fa-solid fa-edit"
                      size="sm"
                      @click="onUpdateSubShop(props.row)"
                    ></q-btn>
                    <q-btn
                      v-if="state.hasEditPermission"
                      color="red"
                      icon="fa-solid fa-trash"
                      size="sm"
                      @click="
                        deleteSubShop(
                          state.subShops.find(
                            (shop) => shop.id === props.row.id
                          ).id
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
                v-if="state.hasEditPermission"
                flat
                outline
                dense
                color="primary"
                label="Bereich hinzufügen"
                @click="state.showSubShopDialog = true"
              ></q-btn>
            </q-card-section>
          </div>
        </q-card>
      </div> -->
    </div>
    <div v-else>
      <div class="row q-py-md">
        <div class="col-4 q-pr-md">
          <q-select
            outlined
            v-model="state.selectedEvent"
            :options="state.events"
            label="Event"
            class="bg-white"
          />
        </div>
        <q-btn
          v-if="!state.selectedShopEvent"
          flat
          outlined
          dense
          color="col-7 q-px-xl primary bg-white"
          label="Werkstatt zuweisen"
          @click="addShopEvent"
        ></q-btn>
        <q-tabs
          v-else
          class="col-4 q-px-xl"
          v-model="state.active_job_tab"
          narrow-indicator
        >
          <q-tab name="default" label="Standard" />
          <q-tab name="detail" label="Zeitslots" />
        </q-tabs>
        <q-btn
          v-if="
            state.selectedShopEvent &&
            state.active_job_tab === 'detail' &&
            state.hasEditPermission
          "
          class="col-3 bg-white"
          outline
          dense
          color="primary"
          label="Zeitslot hinzufügen"
          @click="state.showAddTimeslotDialog = true"
        />
      </div>
      <div v-if="state.selectedShopEvent">
        <div v-if="state.active_job_tab === 'default'">
          <q-table
            title="Mitarbeiter"
            :rows="state.selectedShopEvent.employees"
            :columns="state.employeesColumns"
            row-key="id"
            class="styled-table"
            :no-data-label="'Keine Daten verfügbar.'"
            :loading-label="'Daten werden geladen...'"
            :loading="state.loading"
            hide-no-data
            hide-pagination
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="first_name" :props="props">
                  {{ props.row.first_name }}
                </q-td>
                <q-td key="last_name" :props="props">
                  {{ props.row.last_name }}
                </q-td>
                <q-td key="email" :props="props">
                  {{ props.row.email }}
                </q-td>
                <q-td key="tel" :props="props">
                  {{ props.row.tel }}
                </q-td>
                <q-td key="birthday" :props="props">
                  {{ props.row.birthday }}</q-td
                >
                <q-td key="actions" :props="props">
                  <div class="q-pa-md q-gutter-sm">
                    <q-btn
                      v-if="state.hasEditPermission"
                      color="red"
                      icon="fa-solid fa-trash"
                      size="sm"
                      @click="deleteEmployee(props.row.id)"
                    ></q-btn>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <q-card dense flat bordered style="max-width: 100%">
            <div class="col">
              <q-card-section class="row">
                <q-btn
                  flat
                  outline
                  dense
                  color="primary"
                  label="Mitarbeiter einteilen"
                  @click="state.showAddEmployeeDialog = true"
                ></q-btn>
              </q-card-section>
            </div>
          </q-card>
        </div>
        <div v-else>
          <div class="q-pa-md row">
            <div
              class="col-4 q-pa-md"
              v-bind:model-value="state.selectedEvent"
              v-for="date in state.allTimeslotDates"
              :key="date"
            >
              <q-card>
                <q-card-section class="bg-primary text-black">
                  <div class="text-h5" style="text-align: center">
                    {{ date }}
                  </div>
                  <div class="text-subtitle1" style="text-align: center">
                    ({{
                      new Date(date).toLocaleString('de', { weekday: 'short' })
                    }})
                  </div>
                </q-card-section>
                <div
                  v-bind:model-value="state.selectedShopEvent"
                  v-for="timeslot in state.selectedShopEvent?.timeslots"
                  :key="timeslot.id"
                >
                  <div v-if="date === timeslot.date">
                    <TimeslotComponent
                      :timeslot="timeslot"
                      :employees="state.persons"
                      :employee-columns="state.employeesColumns"
                      :hasEditPermission="state.hasEditPermission"
                      @update-shop="refreshShops"
                    ></TimeslotComponent>
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="state.showSubShopDialog" @hide="close">
      <q-card class="q-pa-md q-gutter-md">
        <q-card-section>
          <div class="text-h6">Bereich</div>
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
            @click="onAddRow"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="state.showAddEmployeeDialog" @hide="close">
      <q-card style="width: 1200px; max-width: 80vw">
        <q-card-section>
          <q-table
            flat
            bordered
            title="Mitarbeiter"
            :rows="state.persons"
            :columns="state.personColumns"
            row-key="id"
            selection="multiple"
            v-model:selected="state.selectedEmployees"
            :filter="state.searchTerm"
            :loading="state.loading"
          >
            <template v-slot:top>
              <div style="width: 100%" class="row">
                <div class="col-4">
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
                </div>
                <div class="q-pl-md col-5">
                  <q-toggle
                    size="md"
                    v-model="state.employeeWasAssignedLastYear"
                    val="md"
                    label="Mitarbeiter war letztes Jahr eingeteilt"
                  />
                </div>
              </div>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Schließen" size="l" @click="close"></q-btn>
          <q-btn
            label="OK"
            color="primary"
            v-close-popup
            @click="addEmployees"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="state.showHaupthelferDialog" @hide="close">
      <q-card style="width: 1200px; max-width: 80vw">
        <q-card-section>
          <q-table
            flat
            bordered
            title="Mitarbeiter"
            :rows="state.persons"
            :columns="state.personColumns"
            row-key="id"
            selection="multiple"
            v-model:selected="state.selectedEmployees"
            :filter="state.searchTerm"
            :loading="state.loading"
          >
            <template v-slot:top>
              <div style="width: 100%" class="row">
                <div class="col-4">
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
                </div>
                <div class="q-pl-md col-5">
                  <q-toggle
                    size="md"
                    v-model="state.employeeWasAssignedLastYear"
                    val="md"
                    label="Mitarbeiter war letztes Jahr eingeteilt"
                  />
                </div>
              </div>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Schließen" size="l" @click="close"></q-btn>
          <q-btn
            label="OK"
            color="primary"
            v-close-popup
            @click="addHaupthelfer"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="state.showAddTimeslotDialog" @hide="close">
      <q-card class="q-pa-md q-gutter-md">
        <q-card-section>
          <div class="text-h6">Zeitslot</div>
        </q-card-section>
        <q-card-section>
          <div style="max-width: 90%">
            <q-input
              label="Datum"
              filled
              v-model="state.editedTimeslot.date"
              mask="date"
              :rules="['date']"
              :language="de"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="state.editedTimeslot.date">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              label="Beginn"
              filled
              v-model="state.editedTimeslot.start_time"
              mask="time"
              :rules="['time']"
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="state.editedTimeslot.start_time"
                      with-seconds
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              label="Ende"
              filled
              v-model="state.editedTimeslot.end_time"
              mask="time"
              :rules="['time']"
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="state.editedTimeslot.end_time"
                      with-seconds
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
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
  </div>
  <div class="q-pa-md" v-else>
    <q-spinner color="primary" size="3em" :thickness="10" />
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
