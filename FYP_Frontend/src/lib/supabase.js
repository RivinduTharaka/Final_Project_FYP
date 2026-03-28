import { createClient } from "@supabase/supabase-js";

// ─── Replace these with your actual values from Supabase → Settings → API ───
const SUPABASE_URL = "https://eusfkwpmnfczovyddhip.supabase.co";   // e.g. https://xxxx.supabase.co
const SUPABASE_ANON = "sb_publishable_pF03QuNuY60qs8tSeSQ94Q_c1XBI8Qv";      // long public anon key
// ─────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
