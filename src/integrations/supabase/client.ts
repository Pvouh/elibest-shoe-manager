
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nizatxqaryleoolhxsci.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pemF0eHFhcnlsZW9vbGh4c2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNTQ1OTYsImV4cCI6MjA2MjYzMDU5Nn0.XbJ-ccUHgN31ODgGCWEfZwY2h97teC3IRCRoGbH9ESw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
