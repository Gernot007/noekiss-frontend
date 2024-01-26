import { supabase } from '../supabase';
import { databaseClient } from './db.service';

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('sb-wzcdkxlwbmrmaeekjsgb-auth-token'))
    ?.user;
}
export async function logout(router) {
  this.loading = true;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    this.session = null;
    this.user = null;
    router.push('/login');
  } catch (error) {
    alert(error.message);
  } finally {
    this.loading = false;
  }
}
export async function signInWithPassword(email, password, router) {
  this.loading = true;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw Error;
    router.push('/');
  } catch (error) {
    this.error = error;
  } finally {
    this.loading = false;
  }
}

export async function signUpNewUser(_data, router) {
  this.loading = true;
  try {
    const settings = await databaseClient.getSettings();

    let role;

    if (settings.registration_code_admin === _data.registrationCode) {
      role = 'Admin';
    } else if (
      settings.registration_code_haupthelfer === _data.registrationCode
    ) {
      role = 'Haupthelfer';
    }

    if (!role) {
      alert('Der Registrierungscode ist ungültig.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: _data.email,
      password: _data.password,
      options: {
        emailRedirectTo: 'http://localhost:9000/login',
        data: {
          ..._data,
          role: role,
          email: undefined,
          password: undefined,
          registrationCode: undefined,
        },
      },
    });

    if (error) throw Error;
    alert('Check your email for the login link!');

    router.push('/login');
  } catch (error) {
    this.error = error;
  } finally {
    this.loading = false;
  }
}
