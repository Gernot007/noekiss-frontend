import { supabase } from '../supabase';

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('sb-yezzfvmotdjgwlnyerfp-auth-token'))
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
export async function signUpNewUser(email, password, router, meta) {
  this.loading = true;
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: 'http://localhost:9000/login',
        data: {
          ...meta,
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
