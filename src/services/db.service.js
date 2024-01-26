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

  async addEmployeeShop(person_id, shop_event_id) {
    const { data, error } = await this.supabase.from('employees_shops').insert({
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
      .from('employees_shops')
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
      .from('employees_shops')
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
      .from('employees_shops')
      .select('*')
      .eq('id', id);
    if (error) {
      throw error;
    }
    return data[0];
  }

  async getEmployeesOfShop(shop_event_id) {
    const { data, error } = await this.supabase
      .from('employees_shops')
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
      .from('employees_shops')
      .select('*')
      .eq('person_id', person_id)
      .eq('shop_event_id', shop_event_id);
    if (error) {
      throw error;
    }
    return data[0];
  }

  async getEmployeeShops() {
    const { data, error } = await this.supabase.from('employees_shops').select(
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
      .from('shops_events')
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
      .from('shops_events')
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
        .from('shops_events')
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
      .from('shops_events')
      .select('*')
      .eq('id', id);
    if (error) {
      throw error;
    }
    return data[0];
  }

  async getShopEventByIds(shop_id, event_id) {
    const { data, error } = await this.supabase
      .from('shops_events')
      .select('*')
      .eq('shop_id', shop_id)
      .eq('event_id', event_id);
    if (error) {
      throw error;
    }
    return data[0];
  }

  async getShopEvents() {
    const { data, error } = await this.supabase.from('shops_events').select(
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
      *
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
