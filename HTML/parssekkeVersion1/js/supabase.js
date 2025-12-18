import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.0';

const runtimeEnv = window._env_ || {};

const SUPABASE_URL = runtimeEnv.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = runtimeEnv.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase environment variables SUPABASE_URL and SUPABASE_ANON_KEY are required.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const PRODUCT_TYPE_COIN = 'coin';
export const PRODUCT_TYPE_GEMSTONE = 'gemstone';


