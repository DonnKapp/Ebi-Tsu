import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://umpbxbkkktwxsieiempg.supabase.co";
const supabasePublishableKey = "sb_publishable_PCXBdb4BUjT6Gh_1S2KuuQ_an63yocM";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
