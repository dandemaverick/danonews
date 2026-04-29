import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hxgqdonkxviplkqtpnaj.supabase.co";
const supabaseKey = "sb_publishable_ueG2B3Dffo7ALAObZiOcbw_NHHrs9bF";

export const supabase = createClient(supabaseUrl, supabaseKey);