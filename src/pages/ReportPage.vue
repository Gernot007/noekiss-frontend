<script setup>
import { onMounted, ref, computed } from 'vue';
import { databaseClient } from '../services/db.service';
import { exportFile, useQuasar } from 'quasar';

let loading = ref(false);
const reportOptions = ref([{ label: 'Eingeteilte Mitarbeiter' }]);
let selectedReport = ref({ label: 'Eingeteilte Mitarbeiter' });
const events = ref([]);
const selectedEvent = ref({});
const shopEvents = ref([]);

onMounted(async () => {
  loading.value = true;
  const _events = await databaseClient.getEvents();
  events.value.push(
    ..._events.map((event) => {
      return { ...event, label: event.name };
    })
  );
  selectedEvent.value = events.value.at(-1);
  shopEvents.value.push(...(await databaseClient.getShopEvents()));
  loading.value = false;
});

const columns = computed(() => {
  if (selectedReport.value.label === 'Eingeteilte Mitarbeiter') {
    return [
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
        name: 'shop',
        label: 'Werkstatt',
        align: 'left',
        field: (row) => row.shop,
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
        name: 'user_id',
        label: 'Benutzerkonto',
        align: 'left',
        field: (row) => row.user_id,
      },
    ];
  }
  return [];
});

const rows = computed(() => {
  if (selectedReport.value.label === 'Eingeteilte Mitarbeiter') {
    const assigneesOfShop = shopEvents.value
      .filter((shopEvent) => shopEvent.event_id === selectedEvent.value.id)
      .map((shopEvent) => [
        ...shopEvent.managers.map((man) => {
          return { ...man, shop: shopEvent.shop.name };
        }),
        ...shopEvent.employees.map((emp) => {
          return { ...emp, shop: shopEvent.shop.name };
        }),
      ])
      .flat();
    const assigneesOfTimeslot = shopEvents.value
      .filter((shopEvent) => shopEvent.event_id === selectedEvent.value.id)
      .map((shopEvent) => [
        ...shopEvent.timeslots.map((timeslot) => [
          ...timeslot.managers.map((man) => {
            return { ...man, shop: shopEvent.shop.name };
          }),
          ...timeslot.employees.map((emp) => {
            return { ...emp, shop: shopEvent.shop.name };
          }),
        ]),
      ])
      .flat()
      .flat();
    return getUniqueArray([...assigneesOfShop, ...assigneesOfTimeslot], ['id']);
  }
  return [];
});

function getUniqueArray(arr, keys) {
  const uniqueArr = [];
  for (const elem of arr) {
    const foreignKey = keys.join('_');

    // set value of key from current object
    // only include specified keys, map keys to value and join to get string value
    elem[foreignKey] = Object.keys(elem)
      .filter((key) => foreignKey.includes(key))
      .map((key) => (key = elem[key]))
      .join('_');

    // only add obj if it's foreignKey does not match one of the already added objects.
    if (!uniqueArr.find((obj) => obj[foreignKey] === elem[foreignKey])) {
      uniqueArr.push(elem);
    }
  }
  return uniqueArr;
}

const $q = useQuasar();

function exportTable() {
  // naive encoding to csv format
  const content = [columns.value.map((col) => wrapCsvValue(col.label))]
    .concat(
      rows.value.map((row) =>
        columns.value
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
      :options="reportOptions"
      v-model="selectedReport"
      label="Report"
      class="q-my-sm bg-white"
    ></q-select>
    <q-select
      outlined
      :options="events"
      v-model="selectedEvent"
      label="Event"
      class="q-my-sm bg-white"
    ></q-select>
    <q-table
      flat
      bordered
      :rows="rows"
      :columns="columns"
      color="primary"
      row-key="id"
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
