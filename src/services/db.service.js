import { supabase } from '../supabase';

export class DatabaseClient {
  supabase = supabase;

  async fetchShops() {
    const { data, error } = await this.supabase.from('shops').select(
      `
        *,
        areas (
          *,
          timeslots (
            *,
            assigned (
              *,
              employees (
                *
              )
            )
          )
        )
      `
    );
    if (error) {
      throw error;
    }
    return data;
  }

  async fetchShop(id) {
    const { data, error } = await this.supabase
      .from('shops')
      .select(
        `
        *,
        areas (
          *,
        timeslots (
          *,
          manager_timeslot (
            employees (
              *
            )
          ),
          assigned (
            *,
            employees (
              *
            )
          )
        ))
    `
      )
      .eq('id', id);
    if (error) {
      throw error;
    }
    if (data && data.length > 0) {
      return data[0];
    }
    return data;
  }

  async createShop(shop) {
    const { data, error } = await supabase.from('shops').insert(shop).select();
    if (error) throw error;
    return data[0];
  }

  async updateShop(id, shop) {
    const { data, error } = await supabase
      .from('shops')
      .update(shop)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  }

  async deleteShop(id) {
    if (confirm('Wollen Sie den Datensatz wirklich löschen?')) {
      const { error } = await supabase.from('shops').delete().eq('id', id);
      if (error) throw error;
      console.debug(`Successfully deleted shop with id '${id}'`);
    }
  }

  async fetchEvents() {
    const { data, error } = await this.supabase.from('events').select();
    if (error) {
      throw error;
    }
    return data;
  }

  async fetchEmployees() {
    const { data, error } = await this.supabase.from('employees').select();
    if (error) {
      throw error;
    }
    return data;
  }

  async createTimeslot(timeslot) {
    const { data, error } = await supabase
      .from('timeslots')
      .insert(timeslot)
      .select();
    if (error) throw error;
    return data[0];
  }

  async deleteTimeslot(timeslot_id) {
    const { data, error } = await supabase
      .from('timeslots')
      .delete()
      .eq('id', timeslot_id);
    if (error) throw error;
    return true;
  }

  async createArea(area) {
    const { data, error } = await supabase.from('areas').insert(area).select(`
    *,
    timeslots (
      *
    )
  `);
    if (error) throw error;
    return data[0];
  }

  async assignToTimeslot(timeslot_id, employee_id) {
    const { data, error } = await supabase
      .from('assigned')
      .insert({
        timeslot_id: timeslot_id,
        employee_id: employee_id,
      })
      .select();
    if (error) throw error;
    return data[0];
  }

  async managerToTimeslot(timeslot_id, employee_id) {
    const { data, error } = await supabase
      .from('manager_timeslot')
      .insert({
        timeslot_id: timeslot_id,
        employee_id: employee_id,
      })
      .select();
    if (error) throw error;
    return data[0];
  }

  async removeManagerFromTimeslot(manager_id) {
    const { error } = await supabase
      .from('manager_timeslot')
      .delete()
      .eq('id', manager_id);
    if (error) throw error;
    console.debug(`Successfully removed manager with id '${manager_id}'`);
    return true;
  }

  async removeAssigneeFromTimeslot(assignee_id) {
    const { error } = await supabase
      .from('assigned')
      .delete()
      .eq('id', assignee_id);
    if (error) throw error;
    console.debug(`Successfully removed assignee with id '${assignee_id}'`);
    return true;
  }
}

export const databaseClient = new DatabaseClient();
