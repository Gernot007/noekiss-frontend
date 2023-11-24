<template>
  <div id="q-app">
    <div class="q-pa-sm q-gutter-sm">
      <q-table
        title="Werkstätten"
        :rows="data"
        :columns="columns"
        row-key="name"
        binary-state-sort
        class="styled-table"
        @row-dblclick="this.$router.push('/shop')"
      >
        <template v-slot:top>
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

          <div class="q-pa-sm q-gutter-sm">
            <q-dialog v-model="show_dialog">
              <q-card class="my-card" flat bordered>
                <q-card-section>
                  <div class="text-h6">Werkstatt hinzufügen</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <q-input v-model="editedItem.name" label="Name"></q-input>
                    <q-input
                      v-model="editedItem.description"
                      label="Beschreibung"
                    ></q-input>
                    <q-input v-model="editedItem.manager" label="Haupthelfer">
                    </q-input>
                  </div>
                </q-card-section>

                <q-card-actions align="center">
                  <q-btn label="Schließen" size="l" @click="close"></q-btn>
                  <q-btn
                    label="OK"
                    color="primary"
                    v-close-popup
                    @click="addRow"
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
                  color="secondary"
                  icon="fa-solid fa-plus"
                  @click="editItem(props.row)"
                  size="sm"
                  spread="true"
                ></q-btn>
                <q-btn
                  color="red"
                  icon="fa-solid fa-trash"
                  @click="deleteItem(props.row)"
                  size="sm"
                ></q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ShopsPage',
  data() {
    return {
      loading: true,
      show_dialog: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        location: '',
      },
      defaultItem: {
        name: '',
        location: '',
      },
      columns: [
        {
          name: 'name',
          label: 'Name',
          align: 'left',
          field: (row) => row.name,
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
          label: 'Aktionen',
          field: 'actions',
        },
      ],
      data: [],
    };
  },
  methods: {
    async addRow() {
      if (this.editedIndex > -1) {
        // only updated
        const res = await supabase
          .from('shops')
          .update(this.editedItem)
          .eq('id', this.editedItem.id);
        if (res.status < 300) {
          this.data[this.editedIndex] = {
            ...this.editedItem,
          };
        }
      } else {
        const res = await supabase.from('shops').insert(this.editedItem);
        if (res.status < 300) {
          this.data.push({
            ...this.editedItem,
          });
        }
      }
      this.close();
    },
    async deleteItem(item) {
      const index = this.data.indexOf(item);
      if (confirm('Wollen Sie den Datensatz wirklich löschen?')) {
        const res = await supabase.from('shops').delete().eq('id', item.id);

        if (res.status < 300) {
          this.data.splice(index, 1);
        }
      }
    },
    async editItem(item, show_dialog = true) {
      this.loading = true;
      this.editedItem = Object.assign({}, item);
      this.editedIndex = this.data.indexOf(item);
      this.show_dialog = show_dialog;
    },
    close() {
      this.show_dialog = false;
      setTimeout(() => {
        this.editedItem = {};
        this.editedIndex = -1;
      }, 300);
    },
    async getShops() {
      const res = await supabase.from('shops').select();
      this.data = res.data.map((obj) => {
        return { ...obj };
      });
    },
  },
  mounted() {
    this.getShops();
  },
});
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 600px
</style>
