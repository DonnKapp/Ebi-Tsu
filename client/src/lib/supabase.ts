import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = "https://umpbxbkkktwxsieiempg.supabase.co";
const supabasePublishableKey = "sb_publishable_PCXBdb4BUjT6Gh_1S2KuuQ_an63yocM";

export const supabase = createClient<Database>(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
