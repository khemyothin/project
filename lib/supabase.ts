import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://wsszzlcuurlcuywtuaha.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indzc3p6bGN1dXJsY3V5d3R1YWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NTIyMzksImV4cCI6MjA4NzIyODIzOX0.nGe0LQIvfRaxCFD7KmoWfF_3pme6cDsyom3S6qdfbyg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
