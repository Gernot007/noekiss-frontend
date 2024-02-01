<script setup>
import { reactive, defineProps, ref, defineEmits } from 'vue';
import { databaseClient } from '../services/db.service';

const props = defineProps([
  'timeslot',
  'employees',
  'employeeColumns',
  'hasEditPermission',
]);
const emit = defineEmits(['updateShop']);

const state = reactive({
  isManager: false,
  loading: false,
  editedItem: {},
  selectedEmployees: [],
  show_select_employee_dialog: false,
  show_assignee_details_dialog: false,
  employeeWasAssignedLastYear: false,
});

async function addAssigneeToTimeslot() {
  const assignees = [];
  for (const employee of state.selectedEmployees) {
    const assigned = await databaseClient.employeeToTimeslot(
      props.timeslot.id,
      employee.id
    );
    assignees.push(assigned);
  }
  emit('updateShop');
  close();
}

function show_user_info() {
  //
}

async function addManagerToTimeslot() {
  const managers = [];
  for (const employee of state.selectedEmployees) {
    const manager = await databaseClient.managerToTimeslot(
      props.timeslot.id,
      employee.id
    );
    managers.push(manager);
  }
  emit('updateShop');
  close();
}

async function deleteTimeslot() {
  await databaseClient.deleteTimeslot(props.timeslot.id);
  emit('updateShop');
}

async function removeEmployeeFromTimeslot(assigned) {
  await databaseClient.removeEmployeeFromTimeslot(
    props.timeslot.id,
    assigned.id
  );
  emit('updateShop');
}

async function removeManagerFromTimeslot(manager) {
  await databaseClient.removeManagerFromTimeslot(props.timeslot.id, manager.id);
  emit('updateShop');
}

function addManager() {
  state.isManager = true;
  state.show_select_employee_dialog = true;
}

function close() {
  state.isManager = false;
  state.selectedEmployees = [];
  state.editedItem = {};
  state.show_select_employee_dialog = false;
  state.show_assignee_details_dialog = false;
  state.employeeWasAssignedLastYear = false;
}
</script>

<template>
  <q-card class="bg-grey-4 q-pa-md">
    <q-card-section class="bg-secondary text-white">
      <div class="text-h6" style="text-align: center">
        {{ props.timeslot.start_time.substring(0, 5) }} -
        {{ props.timeslot.end_time.substring(0, 5) }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="q-pb-sm text-h6" style="text-align: left">
        Verantwortliche
      </div>
      <q-list bordered separator v-if="props.timeslot.managers?.length">
        <q-item
          v-for="manager in props.timeslot.managers"
          :key="manager.id"
          v-ripple
          clickable
        >
          <q-item-section>
            <q-item-label>
              {{ manager.first_name }}
              {{ manager.last_name }}
            </q-item-label>
          </q-item-section>
          <q-btn
            v-if="props.hasEditPermission"
            flat
            style="margin-left: 1em; color: rgb(115, 3, 3)"
            icon="fa-solid fa-x"
            @click="removeManagerFromTimeslot(manager)"
          ></q-btn>
        </q-item>
      </q-list>
      <q-card-actions align="center" style="color: rgb(1, 103, 1)">
        <q-btn
          v-if="props.hasEditPermission"
          flat
          style="margin-left: 1em"
          icon="fa-solid fa-plus"
          @click="addManager"
        ></q-btn>
      </q-card-actions>

      <div class="q-pb-sm text-h6" style="text-align: left">Mitarbeiter</div>
      <q-list bordered separator v-if="props.timeslot.employees?.length">
        <q-item
          v-for="employee in props.timeslot.employees"
          :key="employee.id"
          v-ripple
          clickable
          @click="show_user_info"
        >
          <q-item-section>
            <q-item-label>
              {{ employee.first_name }}
              {{ employee.last_name }}
            </q-item-label>
          </q-item-section>
          <q-btn
            v-if="props.hasEditPermission"
            flat
            style="margin-left: 1em; color: rgb(115, 3, 3)"
            icon="fa-solid fa-x"
            @click="removeEmployeeFromTimeslot(employee)"
          ></q-btn>
        </q-item>
      </q-list>
      <q-card-actions align="center" style="color: rgb(1, 103, 1)">
        <q-btn
          v-if="props.hasEditPermission"
          flat
          style="margin-left: 1em"
          icon="fa-solid fa-plus"
          @click="state.show_select_employee_dialog = true"
        ></q-btn>
      </q-card-actions>
    </q-card-section>

    <q-card-actions
      v-if="props.hasEditPermission"
      align="center"
      style="color: rgb(1, 103, 1); background-color: rgb(195, 77, 77)"
    >
      <q-btn
        flat
        style="margin-left: 1em; color: rgb(59, 58, 58)"
        icon="fa-solid fa-trash"
        @click="deleteTimeslot"
      ></q-btn>
    </q-card-actions>
  </q-card>

  <q-dialog v-model="state.show_select_employee_dialog">
    <q-card style="width: 1200px; max-width: 80vw">
      <q-card-section>
        <q-table
          v-if="props.hasEditPermission"
          flat
          bordered
          title="Mitarbeiter hinzufügen"
          :rows="props.employees"
          :columns="props.employeeColumns"
          row-key="id"
          selection="multiple"
          v-model:selected="state.selectedEmployees"
          hide-pagination
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
          @click="
            state.isManager ? addManagerToTimeslot() : addAssigneeToTimeslot()
          "
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
