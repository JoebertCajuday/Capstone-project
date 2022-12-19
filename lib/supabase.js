import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { RealtimeClient } from '@supabase/realtime-js'
import { SUPABASE_KEY } from '@env';

const supabaseUrl = 'https://vxtdvbgqcnzxevlqgqmx.supabase.co'
const supabaseAnonKey = SUPABASE_KEY
const REALTIME_URL = 'wss://https://vxtdvbgqcnzxevlqgqmx.supabase.co'

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

export const client = new RealtimeClient(REALTIME_URL, {
  params: {
    apiKey: SUPABASE_KEY,
    eventsPerSecond: 10,
  },
})

