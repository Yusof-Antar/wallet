import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDashboardData } from './actions'
import { DashboardClient } from '@/components/dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const data = await getDashboardData()

  if ('error' in data) {
    redirect('/auth/login')
  }

  // Get user profile for currency and display name
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <DashboardClient
      accounts={data.accounts}
      categories={data.categories}
      transactions={data.transactions}
      monthlyIncome={data.monthlyIncome}
      monthlyExpense={data.monthlyExpense}
      totalBalance={data.totalBalance}
      displayName={profile?.display_name || user.user_metadata?.display_name}
      currency={profile?.currency || 'USD'}
    />
  )
}
