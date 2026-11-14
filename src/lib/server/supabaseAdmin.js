import { createClient } from '@supabase/supabase-js';

// Server-side admin client using the Secret API Key (Bypasses RLS for trusted server actions)
// Note: Never hardcode secret keys in source files; set SUPABASE_SECRET_KEY in Vercel / .env
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.VITE_SUPABASE_SECRET_KEY || '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey || 'dummy-secret-key', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});