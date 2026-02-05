import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTransactionsData } from './actions'
import { TransactionsClient } from '@/components/transactions-client'

export default async function TransactionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const data = await getTransactionsData()

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
    <TransactionsClient
      accounts={data.accounts}
      categories={data.categories}
      transactions={data.transactions}
      currency={profile?.currency || 'USD'}
    />
  )
}
