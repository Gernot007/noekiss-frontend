<script setup>
import { reactive, defineProps, ref, defineEmits } from 'vue';
import { databaseClient } from '../services/db.service';

const props = defineProps(['timeslot', 'employees']);
const emit = defineEmits(['updateShop']);

const state = reactive({
  isManager: false,
  loading: false,
  editedItem: {},
  selectedEmployees: [],
  show_select_employee_dialog: false,
  show_assignee_details_dialog: false,
});

async function addAssigneeToTimeslot() {
  state.loading = true;
  const assignees = [];
  for (const employee of state.selectedEmployees) {
    const assigned = await databaseClient.assignToTimeslot(
      props.timeslot.id,
      employee.id
    );
    assignees.push(assigned);
  }
  emit('updateShop');
  close();
}

async function addManagerToTimeslot() {
  state.loading = true;
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
  if (confirm('Wollen Sie den Zeitslot wirklich löschen?')) {
    await databaseClient.deleteTimeslot(props.timeslot.id);
  }
  emit('updateShop');
}

async function removeAssigneeFromTimeslot(assigned) {
  await databaseClient.removeAssigneeFromTimeslot(assigned.id);
  emit('updateShop');
}

async function removeManagerFromTimeslot(manager) {
  await databaseClient.removeManagerFromTimeslot(manager.id);
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
}
</script>

<template>
  <div class="q-pa-md row items-start q-gutter-sm">
    <q-card class="medium-width text-black">
      <q-card-section class="bg-secondary text-white">
        <div class="text-h6" style="text-align: center">
          {{ props.timeslot.start_time.substring(0, 5) }} -
          {{ props.timeslot.end_time.substring(0, 5) }}
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-pa-md text-h6" style="text-align: center">
          Verantwortliche
        </div>
        <q-list bordered separator>
          <q-item
            v-for="manager in props.timeslot.manager_timeslot"
            :key="manager.id"
            v-ripple
            clickable
          >
            <q-item-section>
              <q-item-label>
                {{ manager.employees.firstname }}
                {{ manager.employees.lastname }}
              </q-item-label>
            </q-item-section>
            <q-btn
              flat
              style="margin-left: 1em; color: rgb(115, 3, 3)"
              icon="fa-solid fa-x"
              @click="removeManagerFromTimeslot"
            ></q-btn>
          </q-item>
        </q-list>
        <q-card-actions align="center" style="color: rgb(1, 103, 1)">
          <q-btn
            flat
            style="margin-left: 1em"
            icon="fa-solid fa-plus"
            @click="addManager"
          ></q-btn>
        </q-card-actions>

        <div class="q-pa-md text-h6" style="text-align: center">
          Mitarbeiter
        </div>
        <q-list bordered separator>
          <q-item
            v-for="assigned in props.timeslot.assigned"
            :key="assigned.id"
            :value="assigned"
            v-ripple
            clickable
            @click="show_user_info"
          >
            <q-item-section>
              <q-item-label>
                {{ assigned.employees.firstname }}
                {{ assigned.employees.lastname }}
              </q-item-label>
            </q-item-section>
            <q-btn
              flat
              style="margin-left: 1em; color: rgb(115, 3, 3)"
              icon="fa-solid fa-x"
              @click="removeAssigneeFromTimeslot(assigned)"
            ></q-btn>
          </q-item>
        </q-list>
        <q-card-actions align="center" style="color: rgb(1, 103, 1)">
          <q-btn
            flat
            style="margin-left: 1em"
            icon="fa-solid fa-plus"
            @click="state.show_select_employee_dialog = true"
          ></q-btn>
        </q-card-actions>
      </q-card-section>

      <q-card-actions
        align="center"
        style="color: rgb(1, 103, 1); background-color: rgb(195, 77, 77)"
      >
        <q-btn
          flat
          style="margin-left: 1em; color: gray"
          icon="fa-solid fa-trash"
          @click="deleteTimeslot"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </div>

  <q-dialog v-model="state.show_select_employee_dialog">
    <q-card style="width: 1200px; max-width: 80vw">
      <q-card-section>
        <q-table
          flat
          bordered
          title="Mitarbeiter hinzufügen"
          :rows="props.employees"
          :columns="[
            {
              name: 'firstname',
              required: true,
              label: 'Vorname',
              align: 'center',
              field: (row) => row.firstname,
              format: (val) => `${val}`,
              sortable: true,
            },
            {
              name: 'lastname',
              required: true,
              label: 'Nachname',
              align: 'center',
              field: (row) => row.lastname,
              format: (val) => `${val}`,
              sortable: true,
            },
            {
              name: 'birthday',
              required: true,
              label: 'Geburtsdatum',
              align: 'center',
              field: (row) => row.birthday,
              format: (val) => `${val}`,
              sortable: true,
            },
            {
              name: 'tel',
              required: true,
              label: 'Tel',
              align: 'center',
              field: (row) => row.tel,
              format: (val) => `${val}`,
              sortable: true,
            },
            {
              name: 'email',
              required: true,
              label: 'E-Mail',
              align: 'center',
              field: (row) => row.email,
              format: (val) => `${val}`,
              sortable: true,
            },
          ]"
          row-key="lastname"
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
          @click="
            state.isManager ? addManagerToTimeslot() : addAssigneeToTimeslot()
          "
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
