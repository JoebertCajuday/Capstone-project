import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
//import { SUPABASE_KEY } from '@env';


const supabaseUrl = 'https://vxtdvbgqcnzxevlqgqmx.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_KEY
//const supabaseAnonKey = SUPABASE_KEY

export default supabase = createClient(supabaseUrl, supabaseAnonKey, {
  
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }, 

  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})


