<script setup>
import { onMounted, reactive, ref } from 'vue';
import { databaseClient } from '../services/db.service';
import { getCurrentUser } from '../services/auth.service';
import { exportFile, useQuasar } from 'quasar';

const user = getCurrentUser();
const isAdmin = ref(user.user_metadata?.role === 'Admin');
const rows = ref([]);
const columns = [];

onMounted(async () => {
  //
});

const $q = useQuasar();

function exportTable() {
  // naive encoding to csv format
  const content = [columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      rows.value.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === 'function'
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(',')
      )
    )
    .join('\r\n');

  const status = exportFile('table-export.csv', content, 'text/csv');

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning',
    });
  }
}

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? '' : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}
</script>

<template>
  <div class="q-pa-md">
    <q-select
      outlined
      :options="[{ label: 'Didis Report' }]"
      label="Report"
      class="q-my-sm bg-white"
    ></q-select>
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      color="primary"
      row-key="name"
    >
      <template v-slot:top-right>
        <q-btn
          color="primary"
          icon-right="archive"
          label="Export to csv"
          no-caps
          @click="exportTable"
        />
      </template>
    </q-table>
  </div>
</template>

<style lang="sass">
.q-card
  width: 100%
  max-width: 800px
</style>
