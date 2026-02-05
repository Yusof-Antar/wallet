import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getChecklists } from './actions'
import { ChecklistsClient } from '@/components/checklists-client'

export default async function ChecklistsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const data = await getChecklists()

  if ('error' in data) {
    redirect('/auth/login')
  }

  // Get user profile for currency
  const { data: profile } = await supabase
    .from('profiles')
    .select('currency')
    .eq('id', user.id)
    .single()

  return (
    <ChecklistsClient
      items={data.items}
      currency={profile?.currency || 'USD'}
    />
  )
}
