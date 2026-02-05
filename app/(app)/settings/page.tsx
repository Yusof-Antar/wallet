import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getProfile } from './actions'
import { SettingsClient } from '@/components/settings-client'

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const data = await getProfile()

  if ('error' in data && data.error) {
    redirect('/auth/login')
  }

  return (
    <SettingsClient
      profile={data.profile || null}
      email={data.email}
      displayName={data.displayName || null}
    />
  )
}
