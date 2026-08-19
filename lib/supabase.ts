import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dgllzmwjzirnvpekjpij.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_iZ00EqMGBu5R3K-e9DKF-A__ABVi7CH'

export const supabase = createClient(url, key)
