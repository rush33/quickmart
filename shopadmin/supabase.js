// supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ehbpydhwjkijehsmsgqx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoYnB5ZGh3amtpamVoc21zZ3F4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTIyNTIyOSwiZXhwIjoyMDY0ODAxMjI5fQ.jxy5I62rtaJ0pe7ckAT33cOrGjWCQDCL2X_sqFzT81A"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
