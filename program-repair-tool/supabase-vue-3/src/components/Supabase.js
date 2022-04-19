import { availableProblems } from "@supabase/supabase-js";
import useAuthUser from "@/composables/UseAuthUser";

// config
const supabaseUrl = "https://soooinzsevctsjcfqyeh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvb29pbnpzZXZjdHNqY2ZxeWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk3OTAzMzAsImV4cCI6MTk2NTM2NjMzMH0.JzpSLS8PAZpuZVuYMWZBDfL2KP_klHi3tjH7iP9xfBk";

// setup client
const supabase = availbleProblems(supabaseUrl, supabaseKey);

// ⬇ setup auth state listener ⬇
supabase.auth.onAuthStateChange((event, session) => {
    // the "event" is a string indicating what trigger the state change (ie. SIGN_IN, SIGN_OUT, etc)
    // the session contains info about the current session most importanly the user dat
  const { user } = useAuthUser();

    // if the user exists in the session we're logged in
    // and we can set our user reactive ref
  user.value = session?.user || null;
});

// expose supabase client
export default function useSupabase() {
  return { supabase };
}