import { supabase, supabaseAdmin } from '../supabase';

class DatabaseClient {
  supabase = supabase;
  supabaseAdmin = supabaseAdmin;

  async getSettings() {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) {
      throw error;
    }
    return data[0];
  }

  async addDateRange(dateRange) {
    const { data, error } = await this.supabase
      .from('date_ranges')
      .insert(dateRange)
      .select('*');
    if (error) {
      throw error;
    }
    return data[0];
  }

  async employeeToTimeslot(timeslot_id, person_id) {
    const { data, error } = await this.supabase
      .from('timeslot_employee')
      .insert({
        timeslot_id,
        person_id,
      })
      .select('*');
    if (error) {
      throw error;
    }
    return data[0];
  }

  async removeEmployeeFromTimeslot(timeslot_id, person_id) {
    const { data, error } = await this.supabase
      .from('timeslot_employee')
      .delete()
      .eq('timeslot_id', timeslot_id)
      .eq('person_id', person_id);
    if (error) {
      throw error;
    }
    return true;
  }

  async managerToTimeslot(timeslot_id, person_id) {
    const { data, error } = await this.supabase
      .from('timeslot_manager')
      .insert({
        timeslot_id,
        person_id,
      })
      .select('*');
    if (error) {
      throw error;
    }
    return data[0];
  }

  async removeManagerFromTimeslot(timeslot_id, person_id) {
    const { data, error } = await this.supabase
      .from('timeslot_manager')
      .delete()
      .eq('timeslot_id', timeslot_id)
      .eq('person_id', person_id);
    if (error) {
      throw error;
    }
    return true;
  }

  async addTimeslot(timeslot) {
    const { data, error } = await this.supabase
      .from('timeslots')
      .insert(timeslot)
      .select('*');
    if (error) {
      throw error;
    }
    return data[0];
  }

  async updateTimeslot(id, timeslot) {
    const { data, error } = await this.supabase
      .from('timeslots')
      .update(timeslot)
      .eq('id', id)
      .select('*');
    if (error) {
      throw error;
    }
    return data[0];
  }

  async deleteTimeslot(id) {
    if (
      confirm(
        'Wollen Sie den Zeitslot wirklich löschen? Dies kann nicht rückgängig gemacht werden.'
      )
    ) {
      const { error } = await this.supabase
        .from('timeslots')
        .delete()
        .eq('id', id);
      if (error) {
        throw error;
      }
      return true;
    }
    return false;
  }

  async getTimeslot(id) {
    const { data, error } = await this.supabase
      .from('timeslots')
      .select('*')
      .eq('id', id);
    if (error) {
      throw error;
    }
    return data[0];
  }

  async getTimeslots() {
    const { data, error } = await this.supabase
      .from('timeslots')
      .select(
        `
      *
    `
      )
      .is('parent_id', null);
    if (error) {
      throw error;
    }
    return data;
  }

  async getSubTimeslots(parent_id) {
    const { data, error } = await this.supabase
      .from('timeslots')
      .select(
        `
      *
    `
      )
      .eq('parent_id', parent_id);
    if (error) {
      throw error;
    }
    return data;
  }

  async addShopManager(shop_id, person_id) {
    const { data, error } = await this.supabase.from('shop_manager').insert({
      shop_id,
      person_id,
    }).select(`
      *,
      person: person_id (*)`);
    if (error) {
      throw error;
    }
    return data[0];
  }

  async deleteMangerFromShop(shop_id, person_id) {
    if (
      confirm(
        'Wollen Sie den Haupthelfer wirklich entfernen? Dies kann nicht rückgängig gemacht werden.'
      )
    ) {
      const { error } = await this.supabase
        .from('shop_manager')
        .delete()
        .eq('shop_id', shop_id)
        .eq('person_id', person_id);
      if (error) {
        throw error;
      }
      return true;
    }
    return false;
  }

  async getManagersOfShop(shop_id) {
    const { data, error } = await this.supabase
      .from('shop_manager')
      .select(
        `
      *,
      manager: person_id (
        *
      )`
      )
      .eq('shop_id', shop_id);
    if (error) {
      throw error;
    }
    return data.map((data) => data.manager);
  }

  async getShopManager() {
    const { data, error } = await this.supabase.from('shop_manager').select(`
      *,
      manager: person_id (
        *
      )
    `);
    if (error) {
      throw error;
    }
    return data;
  }

  async addEmployeeShop(person_id, shop_event_id) {
    const { data, error } = await this.supabase
      .from('shop_event_employee')
      .insert({
        person_id,
        shop_event_id,
      }).select(`*,
      person: person_id (
        *
      )`);
    if (error) {
      throw error;
    }
    return data[0];
  }

  async updateEmployeeShop(id, employeeShop) {
    const { data, error } = await this.supabase
      .from('shop_event_employee')
      .update(employeeShop)
      .eq('id', id)
      .select('*');
    if (error) {
      throw error;
    }
    return data[0];
  }

  async deleteEmployeeShop(person_id, shop_event_id) {
    const { error } = await this.supabase
      .from('shop_event_employee')
      .delete()
      .eq('person_id', person_id)
      .eq('shop_event_id', shop_event_id);
    if (error) {
      throw error;
    }
    return true;
  }

  async getEmployeeShopById(id) {
    const { data, error } = await this.supabase
      .from('shop_event_employee')
      .select('*')
      .eq('id', id);
    if (error) {
      throw error;
    }
    return data[0];
  }

  async getEmployeesOfShop(shop_event_id) {
    const { data, error } = await this.supabase
      .from('shop_event_employee')
      .select(
        `
      *,
      person: person_id (
        *
      )
      `
      )
      .eq('shop_event_id', shop_event_id);
    if (error) {
      throw error;
    }
    return data.map((obj) => obj.person);
  }

  async getEmployeeShopByIds(person_id, shop_event_id) {
    const { data, error } = await this.supabase
      .from('shop_event_employee')
      .select('*')
      .eq('person_id', person_id)
      .eq('shop_event_id', shop_event_id);
    if (error) {
      throw error;
    }
    return data[0];
  }

  async getEmployeeShops() {
    const { data, error } = await this.supabase
      .from('shop_event_employee')
      .select(
        `
      *
    `
      );
    if (error) {
      throw error;
    }
    return data;
  }

  async addShopEvent(shop_id, event_id) {
    const { data, error } = await this.supabase
      .from('shop_event')
      .insert({
        shop_id,
        event_id,
      })
      .select('*');
    if (error) {
      throw error;
    }
    return data[0];
  }

  async updateShopEvent(id, shopEvent) {
    const { data, error } = await this.supabase
      .from('shop_event')
      .update(shopEvent)
      .eq('id', id)
      .select('*');
    if (error) {
      throw error;
    }
    return data[0];
  }

  async deleteShopEvent(id) {
    if (
      confirm(
        'Wollen Sie die Werkstatt / den Bereich wirklich löschen? Dies kann nicht rückgängig gemacht werden.'
      )
    ) {
      const { error } = await this.supabase
        .from('shop_event')
        .delete()
        .eq('id', id);
      if (error) {
        throw error;
      }
      return true;
    }
    return false;
  }

  async getShopEventById(id) {
    const { data, error } = await this.supabase
      .from('shop_event')

      .select(
        `*,
        managers: shop_event_manager (
          managers: person_id (*)
        ),
        employees: shop_event_employee (
          employees: person_id (*)
        ),
      timeslots (
        *,
        managers: timeslot_manager (
          managers: person_id (*)
        ),
        employees: timeslot_employee (
          employees: person_id (*)
        )
      )`
      )
      .eq('id', id);
    if (error) {
      throw error;
    }
    if (data[0]) {
      return {
        ...data[0],
        managers: data[0].managers?.map((obj) => obj.managers),
        employees: data[0].employees?.map((obj) => obj.employees),
        timeslots: data[0].timeslots.map((timeslot) => {
          return {
            ...timeslot,
            managers: timeslot.managers?.map((obj) => obj.managers),
            employees: timeslot.employees?.map((obj) => obj.employees),
          };
        }),
      };
    }
  }

  async getShopEventByIds(shop_id, event_id) {
    const { data, error } = await this.supabase
      .from('shop_event')
      .select(
        `*,
        managers: shop_event_manager (
          managers: person_id (*)
        ),
        employees: shop_event_employee (
          employees: person_id (*)
        ),
      timeslots (
        *,
        managers: timeslot_manager (
          managers: person_id (*)
        ),
        employees: timeslot_employee (
          employees: person_id (*)
        )
      )`
      )
      .eq('shop_id', shop_id)
      .eq('event_id', event_id);
    if (error) {
      throw error;
    }
    if (data[0]) {
      return {
        ...data[0],
        managers: data[0].managers?.map((obj) => obj.managers),
        employees: data[0].employees?.map((obj) => obj.employees),
        timeslots: data[0].timeslots.map((timeslot) => {
          return {
            ...timeslot,
            managers: timeslot.managers?.map((obj) => obj.managers),
            employees: timeslot.employees?.map((obj) => obj.employees),
          };
        }),
      };
    }
  }

  async getShopEvents() {
    const { data, error } = await this.supabase.from('shop_event').select(
      `
      *
    `
    );
    if (error) {
      throw error;
    }
    return data;
  }

  async addShop(shop) {
    const { data, error } = await this.supabase
      .from('shops')
      .insert(shop)
      .select('*');
    if (error) {
      throw error;
    }
    return data[0];
  }

  async updateShop(id, shop) {
    const { data, error } = await this.supabase
      .from('shops')
      .update(shop)
      .eq('id', id)
      .select('*');
    if (error) {
      throw error;
    }
    return data[0];
  }

  async deleteShop(id) {
    if (
      confirm(
        'Wollen Sie die Werkstatt / den Bereich wirklich löschen? Dies kann nicht rückgängig gemacht werden.'
      )
    ) {
      const { error } = await this.supabase.from('shops').delete().eq('id', id);
      if (error) {
        throw error;
      }
      return true;
    }
    return false;
  }

  async getShop(id) {
    const { data, error } = await this.supabase
      .from('shops')
      .select('*')
      .eq('id', id);
    if (error) {
      throw error;
    }
    return data[0];
  }

  async getShops() {
    const { data, error } = await this.supabase
      .from('shops')
      .select(
        `
      *,
      shop_manager (
        manager: person_id (
          *
        )
      )
    `
      )
      .is('parent_id', null);
    if (error) {
      throw error;
    }
    return data;
  }

  async getSubShops(parent_id) {
    const { data, error } = await this.supabase
      .from('shops')
      .select(
        `
      *
    `
      )
      .eq('parent_id', parent_id);
    if (error) {
      throw error;
    }
    return data;
  }

  async addEvent(event) {
    const { data, error } = await this.supabase
      .from('events')
      .insert(event)
      .select('*');
    if (error) {
      throw error;
    }
    return data[0];
  }

  async deleteEvent(id) {
    if (
      confirm(
        'Wollen Sie die Veranstaltung wirklich löschen? Dies kann nicht rückgängig gemacht werden.'
      )
    ) {
      const { error } = await this.supabase
        .from('events')
        .delete()
        .eq('id', id);
      if (error) {
        throw error;
      }
      return true;
    }
    return false;
  }

  async getEvent(id) {
    const { data, error } = await this.supabase
      .from('events')
      .eq('id', id)
      .select('*');
    if (error) {
      throw error;
    }
    return data;
  }

  async getEvents() {
    const { data, error } = await this.supabase.from('events').select(`
      *,
      date_ranges (
        *
      )
    `);
    if (error) {
      throw error;
    }
    return data;
  }

  async addPerson(person) {
    const { data, error } = await this.supabase
      .from('persons')
      .insert(person)
      .select('*');
    if (error) {
      throw error;
    }
    return data[0];
  }

  async updatePerson(id, person) {
    const { data, error } = await this.supabase
      .from('persons')
      .update(person)
      .eq('id', id)
      .select('*');
    if (error) {
      throw error;
    }
    return data[0];
  }

  async deletePerson(id) {
    if (
      confirm(
        'Wollen Sie den Mitarbeiter wirklich löschen? Dies kann nicht rückgängig gemacht werden.'
      )
    ) {
      const { error } = await this.supabase
        .from('persons')
        .delete()
        .eq('id', id);
      if (error) {
        throw error;
      }
      return true;
    }
    return false;
  }

  async getPerson(id) {
    const { data, error } = await this.supabase
      .from('persons')
      .eq('id', id)
      .select('*');
    if (error) {
      throw error;
    }
    return data;
  }

  async getPersons() {
    const { data, error } = await this.supabase.from('persons').select('*');
    if (error) {
      throw error;
    }
    return data;
  }

  async addUser(user) {
    const { data, error } = await this.supabase
      .from('users')
      .insert(user)
      .select('*');
    if (error) {
      throw error;
    }
    return data;
  }

  async deleteUser(id) {
    if (
      confirm(
        'Wollen Sie den Benutzer wirklich löschen? Dies kann nicht rückgängig gemacht werden.'
      )
    ) {
      const { error } = await this.supabaseAdmin.auth.admin.deleteUser(id);

      if (error) {
        throw error;
      }
      return true;
    }
    return false;
  }

  async createUser(user) {
    const { data, error } = await this.supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.password,
      emailConfirm: true,
      user_metadata: {
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });

    if (error) {
      throw error;
    }

    return {
      id: user.id,
      email: data.user.email,
      created_at: data.user.created_at,
      ...data.user.user_metadata,
    };
  }

  async getUser(id) {
    const { data, error } = await supabase.auth.admin.getUserById(id);
    if (error) {
      throw error;
    }
    return {
      id: user.id,
      email: data.user.email,
      created_at: data.user.created_at,
      ...data.user.user_metadata,
    };
  }

  async getUsers() {
    const {
      data: { users },
      error,
    } = await this.supabaseAdmin.auth.admin.listUsers();
    if (error) {
      throw error;
    }
    return users.map((user) => {
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        ...user.user_metadata,
      };
    });
  }
}

export const databaseClient = new DatabaseClient();
