import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE;

const options = {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);
export const supabaseAdmin = new SupabaseClient(supabaseUrl, serviceRoleKey);
