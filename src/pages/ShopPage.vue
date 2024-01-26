<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { databaseClient } from '../services/db.service';

const route = useRoute();

const state = reactive({
  show_dialog: false,
  editedId: -1,
  editedItem: {},
  subShops: [],
  showSubShopDialog: false,
  showAddEmployeeDialog: false,
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
  selectedShop: {},
  selectedEvent: {},
  selectedShopEvent: null,
  events: [],
  active_tab: 'default',
  persons: [],
  employees: [],
  selectedEmployees: [],
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
  state.selectedShopEvent = await databaseClient.getShopEventByIds(
    route.params.id,
    state.selectedEvent.id
  );
  state.employees = await databaseClient.getEmployeesOfShop(
    state.selectedShopEvent.id
  );
  state.persons = await databaseClient.getPersons();
});

async function onAddRow() {
  if (state.editedId > -1) {
    await updateSubShop(state.editedId, state.editedItem);
  } else {
    await createSubShop(state.editedItem);
  }
  close();
}

function onUpdateSubShop(item) {
  state.loading = true;
  state.showSubShopDialog = true;
  state.editedItem = Object.assign({}, item);
  state.editedId = item.id;
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

async function deleteSubShop(id) {
  const shopDeleted = await databaseClient.deleteShop(id);
  if (shopDeleted) {
    state.subShops.splice(
      state.subShops.findIndex((shop) => shop.id === id),
      1
    );
  }
}

function close() {
  state.loading = false;
  state.show_dialog = false;
  state.editedItem = {};
  state.showSubShopDialog = false;
  state.showAddEmployeeDialog = false;
}

async function addShopEvent() {
  if (
    confirm(
      `Die Werkstatt ${state.selectedShop.name} wird einmalig der Veranstaltung ${state.selectedEvent.name} zugewiesen.`
    )
  ) {
    state.selectedShopEvent = await databaseClient.addShopEvent(
      state.selectedShop.id,
      state.selectedEvent.id
    );
  }
}

async function addEmployees() {
  for (const employee of state.selectedEmployees) {
    try {
      const data = await databaseClient.addEmployeeShop(
        employee.id,
        state.selectedShopEvent.id
      );
      state.employees.push(data.person);
    } catch (error) {
      console.error(error);
    }
  }
}

async function deleteEmployee(person_id) {
  try {
    await databaseClient.deleteEmployeeShop(
      person_id,
      state.selectedShopEvent.id
    );
    state.employees.splice(
      state.employees.findIndex((employee) => employee.id === person_id),
      1
    );
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="q-pa-md">
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
        </div>
      </q-card>
    </div>

    <div v-if="state.selectedShop.hasAreas || state.subShops.length">
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
                    color="orange"
                    icon="fa-solid fa-edit"
                    size="sm"
                    @click="onUpdateSubShop(props.row)"
                  ></q-btn>
                  <q-btn
                    color="red"
                    icon="fa-solid fa-trash"
                    size="sm"
                    @click="
                      deleteSubShop(
                        state.subShops.find((shop) => shop.id === props.row.id)
                          .id
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
              label="Bereich hinzufügen"
              @click="state.showSubShopDialog = true"
            ></q-btn>
          </q-card-section>
        </div>
      </q-card>
    </div>
    <div v-else>
      <div class="q-pb-md">
        <q-select
          outlined
          v-model="state.selectedEvent"
          :options="state.events"
          label="Event"
          class="bg-white"
        />
      </div>
      <div v-if="state.selectedShopEvent">
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
          <q-table
            title="Mitarbeiter"
            :rows="state.employees"
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
                  label="Werkstatt der Veranstaltung zuweisen"
                  @click="addShopEvent"
                ></q-btn>
              </q-card-section>
            </div>
          </q-card>
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
              type="texr"
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
            title="Mitarbeiter hinzufügen"
            :rows="state.persons"
            :columns="state.personColumns"
            row-key="id"
            selection="multiple"
            v-model:selected="state.selectedEmployees"
          />
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
