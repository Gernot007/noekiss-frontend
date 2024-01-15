<template>
  <div id="q-app">
    <div class="q-pa-sm q-gutter-sm">
      <q-table
        title="Werkstätten"
        :rows="state.shops"
        :columns="state.columns"
        row-key="name"
        binary-state-sort
        class="styled-table"
      >
        <template v-slot:top> </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="managers" :props="props">
              {{ props.row.managers }}
            </q-td>
            <q-td key="description" :props="props">
              {{ props.row.description }}
            </q-td>
            <q-td key="actions" :props="props">
              <div class="q-pa-md q-gutter-sm">
                <q-btn
                  color="blue"
                  icon="fa-solid fa-eye"
                  @click="
                    this.$router.push(
                      '/shops/' +
                        state.shops.find((shop) => shop.id === props.row.id).id
                    )
                  "
                  size="sm"
                ></q-btn>
                <q-btn
                  color="secondary"
                  icon="fa-solid fa-edit"
                  @click="onUpdateShop(props.row)"
                  size="sm"
                  spread="true"
                ></q-btn>
                <q-btn
                  color="red"
                  icon="fa-solid fa-trash"
                  @click="
                    deleteShop(
                      state.shops.find((shop) => shop.id === props.row.id).id
                    )
                  "
                  size="sm"
                ></q-btn>
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
          label="Werkstatt hinzufügen"
          @click="show_dialog = true"
        ></q-btn>
      </div>
    </div>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="state.show_dialog">
      <q-card style="width: 1200px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Werkstatt</div>
        </q-card-section>

        <q-card-section>
          <div class="row">
            <div class="q-pa-md row items-start q-gutter-md">
              <q-input v-model="state.editedItem.name" label="Name"></q-input>
              <q-input
                v-model="state.editedItem.description"
                label="Beschreibung"
              ></q-input>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-table
            flat
            bordered
            title="Haupthelfer"
            :rows="state.haupthelfer"
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
            row-key="name"
            :selected-rows-label="getSelectedString"
            selection="multiple"
            v-model:selected="state.editedItem.manager"
          />
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

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { databaseClient } from '../services/db.service';

const state = reactive({
  loading: false,
  shops: [],
  selected: [],
  data: [],
  haupthelfer: [],
  show_dialog: false,
  editedId: -1,
  editedItem: {},
  columns: [
    {
      name: 'name',
      label: 'Name',
      align: 'left',
      field: (row) => row.name,
      sortable: true,
    },
    {
      name: 'managers',
      label: 'Haupthelfer',
      align: 'left',
      field: (row) => row.managers,
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
  ],
});

async function onAddRow() {
  if (state.editedId > -1) {
    await updateShop(state.editedId, state.editedItem);
  } else {
    await createShop(state.editedItem);
  }
  close();
}

async function updateShop(id, shop) {
  const { data } = await databaseClient.updateShop(id, shop);
  const index = state.shops.findIndex((shop) => shop.id === id);
  const updatedItem = ref(state.shops[index]);
  updatedItem.value = Object.assign(this.shops[index], data);
  console.debug(`Successfully updated shop with id: '${id}'`);
}

async function createShop(shop) {
  const { data } = await databaseClient.createShop(shop);
  state.shops.push(data);
  console.debug('Successfully created shop.');
}

async function deleteShop(id) {
  await databaseClient.deleteShop(id);
  state.shops.splice(
    state.shops.findIndex((shop) => shop.id === id),
    1
  );
}

function onUpdateShop(item) {
  state.loading = true;
  state.show_dialog = true;
  state.editedItem = Object.assign({}, item);
  state.editedId = item.id;
}

function close() {
  state.editedId = -1;
  state.editedItem = {};
  state.show_dialog = false;
  state.loading = false;
}

onMounted(async () => {
  state.shops = await databaseClient.fetchShops();
  state.haupthelfer = await databaseClient.fetchEmployees(); // TODO: Filter for role=Haupthelfer
});
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 600px
</style>
