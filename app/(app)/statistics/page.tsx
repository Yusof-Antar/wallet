import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getStatisticsData } from './actions'
import { StatisticsClient } from '@/components/statistics-client'

export default async function StatisticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const data = await getStatisticsData('month')

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
    <StatisticsClient
      totalIncome={data.totalIncome}
      totalExpense={data.totalExpense}
      categoryStats={data.categoryStats}
      monthlyStats={data.monthlyStats}
      currency={profile?.currency || 'USD'}
    />
  )
}
