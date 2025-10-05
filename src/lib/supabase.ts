import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if we have valid Supabase configuration
const isValidUrl = supabaseUrl && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))
const hasValidConfig = isValidUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-ref')

export const supabase = hasValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null