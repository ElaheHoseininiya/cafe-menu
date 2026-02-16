import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xjrfdujwvaiigkelcwip.supabase.co'           // URL پروژه از Supabase
const supabaseAnonKey = 'sb_publishable_WMZOZy6xrGTK_lo0j9I7Sg_BLnCg5yQ'   // sb_publishable_...

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
