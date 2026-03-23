import {createClient} from "@supabase/supabase-js"

const SUPABASE_URL = "https://axhwivsmaaepwyljzhtr.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4aHdpdnNtYWFlcHd5bGp6aHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4ODE4OTMsImV4cCI6MjA4OTQ1Nzg5M30.OuM6pNG6XtK3cFO5hwiuf0Od89gK3Kx4-BneWshDzY8"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);