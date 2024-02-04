<script setup>
import { onMounted, reactive } from 'vue';
import { databaseClient } from '../services/db.service';

const state = reactive({
  shops: [],
  loading: false,
  searchTerm: '',
  show_dialog: false,
  editedId: -1,
  editedItem: {},
  columns: [
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
      sortable: true,
      align: 'left',
      field: (row) => row.description,
    },
    {
      name: 'created_at',
      label: 'Erstellt am',
      align: 'left',
      field: (row) => row.created_at,
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
    await updateShop(state.editedId, state.editedItem);
  } else {
    await createShop(state.editedItem);
  }
  close();
}

function onUpdateShop(item) {
  state.loading = true;
  state.show_dialog = true;
  state.editedItem = Object.assign({}, item);
  state.editedId = item.id;
}

async function updateShop(id, shop) {
  const shopData = await databaseClient.updateShop(id, shop);
  const index = state.shops.findIndex((shop) => shop.id === id);
  Object.assign(state.shops[index], shopData);
  console.debug(`Successfully updated shop with id: '${id}'`);
}

async function createShop(shop) {
  const shopData = await databaseClient.addShop(shop);
  state.shops.push(shopData);
}

async function deleteShop(id) {
  const shopDeleted = await databaseClient.deleteShop(id);
  if (shopDeleted) {
    state.shops.splice(
      state.shops.findIndex((shop) => shop.id === id),
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

function getPaginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
  return `${firstRowIndex}-${endRowIndex} von ${totalRowsNumber}`;
}

onMounted(async () => {
  state.loading = true;
  state.shops = await databaseClient.getShops();
  state.loading = false;
});
</script>

<template>
  <div class="q-pa-md">
    <q-card dense flat bordered style="max-width: 100%">
      <q-table
        :loading="state.loading"
        title="Werkstatt"
        :rows="state.shops"
        :columns="state.columns"
        row-key="id"
        :no-data-label="'Keine Daten verfügbar.'"
        :loading-label="'Daten werden geladen...'"
        :no-results-label="'Die Suchabfrage ergab keine Treffer.'"
        :rows-per-page-label="'Zeilen pro Seite'"
        :pagination-label="getPaginationLabel"
        :filter="state.searchTerm"
        class="styled-table"
      >
        <template v-slot:top>
          <div class="text-h6 q-pb-md">Werkstättenübersicht</div>
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
            <q-td key="description" type="textarea" :props="props">
              {{ props.row.description }}
            </q-td>
            <q-td key="created_at" :props="props">
              {{ new Date(props.row.created_at).toLocaleString() }}
            </q-td>
            <q-td key="actions" :props="props">
              <div class="q-pa-md q-gutter-sm">
                <q-btn
                  color="blue"
                  icon="fa-solid fa-eye"
                  size="sm"
                  spread="true"
                  @click="
                    this.$router.push({
                      path: `/shops/${props.row.id}`,
                      query: {
                        active_tab: 'overview',
                        active_job_tab: 'default',
                        event: '',
                      },
                    })
                  "
                ></q-btn>
                <q-btn
                  color="secondary"
                  icon="fa-solid fa-edit"
                  size="sm"
                  spread="true"
                  @click="onUpdateShop(props.row)"
                ></q-btn>
                <q-btn
                  color="red"
                  icon="fa-solid fa-trash"
                  size="sm"
                  @click="
                    deleteShop(
                      state.shops.find((shop) => shop.id === props.row.id).id
                    )
                  "
                ></q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="col-3">
        <q-card-section class="row">
          <q-btn
            flat
            outline
            dense
            color="primary"
            label="Werkstatt hinzufügen"
            @click="state.show_dialog = true"
          ></q-btn>
        </q-card-section>
      </div>
    </q-card>
  </div>

  <q-dialog v-model="state.show_dialog" @hide="close">
    <q-card class="q-pa-md q-gutter-md">
      <q-card-section>
        <div class="text-h6">Werkstatt</div>
      </q-card-section>

      <q-card-section>
        <div style="max-width: 90%">
          <q-input v-model="state.editedItem.name" label="Name"></q-input>
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
</template>

<style lang="sass" scoped>
.q-card
  width: 100%
  max-width: 800px
</style>
