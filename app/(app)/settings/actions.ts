'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import type { Profile } from '@/lib/types'

export async function getProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    return { error: error.message }
  }

  return {
    profile: profile as Profile | null,
    email: user.email,
    displayName: profile?.display_name || user.user_metadata?.display_name || null,
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const displayName = formData.get('display_name') as string
  const currency = formData.get('currency') as string

  // Upsert profile
  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      display_name: displayName || null,
      currency: currency || 'USD',
    },
    { onConflict: 'id' }
  )

  if (error) {
    return { error: error.message }
  }

  // Also update user metadata
  await supabase.auth.updateUser({
    data: { display_name: displayName },
  })

  revalidateTag('profile', 'max')
  revalidateTag('dashboard', 'max')
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return { success: true }
}
