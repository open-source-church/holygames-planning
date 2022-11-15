import { createClient } from "@supabase/supabase-js";

var SUPABASE_URL = "https://pcwulcmwbblddkjxzrge.supabase.co";
var SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjd3VsY213YmJsZGRranh6cmdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ1NDI4MzksImV4cCI6MTk4MDExODgzOX0.cgin7N-zP88pDFIRColDDr08d0tkcRBx9ihjF7eh1cM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
