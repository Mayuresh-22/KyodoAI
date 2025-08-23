import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log(supabaseUrl)
console.log(supabaseAnonKey)

if (!supabaseUrl) throw new Error('Missing SUPABASE_URL environment variable')
if (!supabaseAnonKey) throw new Error('Missing SUPABASE_ANON_KEY environment variable')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
