import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * 🔴 مقادیر را مستقیم از Supabase بگیر
 * Project Settings → API Keys → anon public
 */

const SUPABASE_URL = 'https://hypprgwtllowuxsgvayt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cHByZ3d0bGxvd3V4c2d2YXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNTE4NDAsImV4cCI6MjA4MTYyNzg0MH0.Ewu62XZp9OwQ5ha9LSnrvCKdPKOeDfXQbzEkaiSW0Ps';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

export const PRODUCT_TYPE_COIN = 'coin';
export const PRODUCT_TYPE_GEMSTONE = 'gemstone';
