import { defineStore } from 'pinia';
import { supabase } from '../supabase';
import { ref } from 'vue';

export const useSupabaseStore = defineStore({
  id: 'supabase',
  state: () => ({
    events: [],
    shops: [],
    timeslots: [],
    assignees: [],
    persons: [],
    event: null,
    shop: null,
    timeslot: null,
    assignee: null,
    loading: false,
    error: null,
  }),
  getters: {
    getShopById: (state) => {
      return (id) => state.shops.find((shop) => shop.id == id);
    },
    getAreasOfShopAndEvent: (state) => {
      return (shop_id, event_id) => {
        const shop = state.shops.find((shop) => shop.id == shop_id);
        const areas = shop.areas.filter((area) => area.event_id == event_id);
        return areas;
      };
    },
    getTimeslotsOfArea: (state) => {
      return (area_id) =>
        state.timeslots.find((timeslot) => timeslot.area_id == area_id);
    },
    getAssigneesOfTimeslot: (state) => {
      return (timeslot_id) =>
        state.assignees.find((assignee) => assignee.timeslot_id == timeslot_id);
    },
  },
  actions: {
    async fetchAll() {
      await this.fetchEvents();
      await this.fetchShops();
      await this.fetchTimeslots();
      await this.fetchAssignees();
    },
    async fetchEvents() {
      this.events = [];
      this.loading = true;
      try {
        const eventsRes = await supabase.from('events').select();
        if (eventsRes.error) throw eventsRes.error;
        this.events = eventsRes.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async fetchEvent(id) {
      this.event = null;
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('events')
          .select()
          .eq('id', id);
        if (error) throw error;
        this.event = data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async createEvent(event) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('events')
          .insert(event)
          .select();
        if (error) throw error;
        this.events.push(data[0]);
        console.debug('Successfully created event');
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async deleteEvent(id) {
      this.loading = true;
      try {
        if (confirm('Wollen Sie den Datensatz wirklich löschen?')) {
          const { error } = await supabase.from('events').delete().eq('id', id);
          if (error) throw error;
          this.events.splice(
            this.events.findIndex((event) => event.id === id),
            1
          );
          console.debug(`Successfully deleted event with id '${id}'`);
        }
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async updateEvent(id, item) {
      this.loading = true;
      try {
        const { error } = await supabase
          .from('events')
          .update(item)
          .eq('id', id)
          .select();
        if (error) throw error;
        const index = this.events.findIndex((event) => event.id === id);
        const updatedItem = ref(this.events[index]);
        updatedItem.value = Object.assign(this.events[index], item);
        console.debug(`Successfully updated event with id: '${id}'`);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async fetchShops() {
      this.shops = [];
      this.loading = true;
      try {
        const shopsRes = await supabase.from('shops').select(`
        *,
        areas (
          *
        )
      `);
        if (shopsRes.error) throw shopsRes.error;
        this.shops = shopsRes.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async fetchShop(id) {
      this.shop = null;
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('shops')
          .select()
          .eq('id', id);
        if (error) throw error;
        this.shop = data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async createShop(shop) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('shops')
          .insert(shop)
          .select();
        if (error) throw error;
        this.shops.push(data[0]);
        console.debug('Successfully created shop');
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async deleteShop(id) {
      this.loading = true;
      try {
        if (confirm('Wollen Sie den Datensatz wirklich löschen?')) {
          const { error } = await supabase.from('shops').delete().eq('id', id);
          if (error) throw error;
          this.shops.splice(
            this.shops.findIndex((shop) => shop.id === id),
            1
          );
          console.debug(`Successfully deleted shop with id '${id}'`);
        }
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async updateShop(id, item) {
      this.loading = true;
      try {
        const { error } = await supabase
          .from('shops')
          .update(item)
          .eq('id', id)
          .select();
        if (error) throw error;
        const index = this.shops.findIndex((shop) => shop.id === id);
        const updatedItem = ref(this.shops[index]);
        updatedItem.value = Object.assign(this.shops[index], item);
        console.debug(`Successfully updated shop with id: '${id}'`);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async createArea(area) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('areas')
          .insert(area)
          .select();
        if (error) throw error;
        this.areas.push(data[0]);
        console.debug('Successfully created area');
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async deleteArea(id) {
      this.loading = true;
      try {
        if (confirm('Wollen Sie den Datensatz wirklich löschen?')) {
          const { error } = await supabase.from('areas').delete().eq('id', id);
          if (error) throw error;
          this.areas.splice(
            this.areas.findIndex((area) => area.id === id),
            1
          );
          console.debug(`Successfully deleted area with id '${id}'`);
        }
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async updateArea(id, item) {
      this.loading = true;
      try {
        const { error } = await supabase
          .from('areas')
          .update(item)
          .eq('id', id)
          .select();
        if (error) throw error;
        const index = this.areas.findIndex((area) => area.id === id);
        const updatedItem = ref(this.areas[index]);
        updatedItem.value = Object.assign(this.areas[index], item);
        console.debug(`Successfully updated area with id: '${id}'`);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async fetchTimeslots() {
      this.timeslots = [];
      this.loading = true;
      try {
        const timeslotsRes = await supabase.from('timeslots').select();
        if (timeslotsRes.error) throw timeslotsRes.error;
        this.timeslots = timeslotsRes.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async fetchTimeslot(id) {
      this.timeslot = null;
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('timeslots')
          .select()
          .eq('id', id);
        if (error) throw error;
        this.timeslot = data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async createTimeslot(timeslot) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('timeslots')
          .insert(timeslot)
          .select();
        if (error) throw error;
        this.timeslots.push(data[0]);
        console.debug('Successfully created timeslot');
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async deleteTimeslot(id) {
      this.loading = true;
      try {
        if (confirm('Wollen Sie den Datensatz wirklich löschen?')) {
          const { error } = await supabase
            .from('timeslots')
            .delete()
            .eq('id', id);
          if (error) throw error;
          this.timeslots.splice(
            this.timeslots.findIndex((timeslot) => timeslot.id === id),
            1
          );
          console.debug(`Successfully deleted timeslot with id '${id}'`);
        }
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async updateTimeslot(id, item) {
      this.loading = true;
      try {
        const { error } = await supabase
          .from('timeslots')
          .update(item)
          .eq('id', id)
          .select();
        if (error) throw error;
        const index = this.timeslots.findIndex(
          (timeslot) => timeslot.id === id
        );
        const updatedItem = ref(this.timeslots[index]);
        updatedItem.value = Object.assign(this.timeslots[index], item);
        console.debug(`Successfully updated timeslot with id: '${id}'`);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async fetchAssignees() {
      this.assignees = [];
      this.loading = true;
      try {
        const assigneesRes = await supabase.from('assignees').select();
        if (assigneesRes.error) throw assigneesRes.error;
        this.assignees = assigneesRes.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async fetchAssignee(id) {
      this.assignee = null;
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('assignees')
          .select()
          .eq('id', id);
        if (error) throw error;
        this.assignee = data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async createAssignee(assignee) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('assignees')
          .insert(assignee)
          .select();
        if (error) throw error;
        this.assignees.push(data[0]);
        console.debug('Successfully created assignee');
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async deleteAssignee(id) {
      this.loading = true;
      try {
        if (confirm('Wollen Sie den Datensatz wirklich löschen?')) {
          const { error } = await supabase
            .from('assignees')
            .delete()
            .eq('id', id);
          if (error) throw error;
          this.assignees.splice(
            this.assignees.findIndex((assignee) => assignee.id === id),
            1
          );
          console.debug(`Successfully deleted assignee with id '${id}'`);
        }
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async updateAssignee(id, item) {
      this.loading = true;
      try {
        const { error } = await supabase
          .from('assignees')
          .update(item)
          .eq('id', id)
          .select();
        if (error) throw error;
        const index = this.assignees.findIndex(
          (assignee) => assignee.id === id
        );
        const updatedItem = ref(this.assignees[index]);
        updatedItem.value = Object.assign(this.assignees[index], item);
        console.debug(`Successfully updated assignee with id: '${id}'`);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async fetchPersons() {
      this.persons = [];
      this.loading = true;
      try {
        const personsRes = await supabase.from('persons').select();
        if (personsRes.error) throw personsRes.error;
        this.persons = personsRes.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async fetchPerson(id) {
      this.person = null;
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('persons')
          .select()
          .eq('id', id);
        if (error) throw error;
        this.person = data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async createPerson(person) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('persons')
          .insert(person)
          .select();
        if (error) throw error;
        this.persons.push(data[0]);
        console.debug('Successfully created person');
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async deletePerson(id) {
      this.loading = true;
      try {
        if (confirm('Wollen Sie den Datensatz wirklich löschen?')) {
          const { error } = await supabase
            .from('persons')
            .delete()
            .eq('id', id);
          if (error) throw error;
          this.persons.splice(
            this.persons.findIndex((person) => person.id === id),
            1
          );
          console.debug(`Successfully deleted person with id '${id}'`);
        }
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async updatePerson(id, item) {
      this.loading = true;
      try {
        const { error } = await supabase
          .from('persons')
          .update(item)
          .eq('id', id)
          .select();
        if (error) throw error;
        const index = this.persons.findIndex((person) => person.id === id);
        const updatedItem = ref(this.persons[index]);
        updatedItem.value = Object.assign(this.persons[index], item);
        console.debug(`Successfully updated person with id: '${id}'`);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
