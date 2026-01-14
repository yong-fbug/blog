import { createClient } from "@supabase/supabase-js";
//PU: Project Url
//PAK: Published API Key

export const supabase = createClient(import.meta.env.VITE_PU, import.meta.env.VITE_PAK);
