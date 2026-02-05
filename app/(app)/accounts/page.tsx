import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAccounts } from './actions'
import { AccountsClient } from '@/components/accounts-client'

export default async function AccountsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const data = await getAccounts()

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
    <AccountsClient
      accounts={data.accounts}
      currency={profile?.currency || 'USD'}
    />
  )
}
