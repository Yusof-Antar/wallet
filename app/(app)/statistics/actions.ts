'use server'

import { createClient } from '@/lib/supabase/server'
import type { CategoryStats, MonthlyStats } from '@/lib/types'

export async function getStatisticsData(period: 'week' | 'month' | 'year' = 'month') {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const now = new Date()
  let startDate: Date

  switch (period) {
    case 'week':
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
      break
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  }

  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = now.toISOString().split('T')[0]

  // Get all transactions in period
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .eq('user_id', user.id)
    .gte('date', startDateStr)
    .lte('date', endDateStr)
    .order('date', { ascending: true })

  if (!transactions) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      categoryStats: [],
      monthlyStats: [],
    }
  }

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  // Calculate category stats for expenses
  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce(
      (acc, t) => {
        const categoryId = t.category_id
        if (!acc[categoryId]) {
          acc[categoryId] = {
            category_id: categoryId,
            category_name: t.category?.name || 'Unknown',
            category_icon: t.category?.icon || 'wallet',
            category_color: t.category?.color || '#6b7280',
            total: 0,
            percentage: 0,
          }
        }
        acc[categoryId].total += Number(t.amount)
        return acc
      },
      {} as Record<string, CategoryStats>
    )

  const categoryStats: CategoryStats[] = Object.values(expensesByCategory)
    .map((stat) => ({
      ...stat,
      percentage: totalExpense > 0 ? (stat.total / totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)

  // Calculate monthly stats (last 6 months)
  const monthlyStats: MonthlyStats[] = []
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStart = monthDate.toISOString().split('T')[0]
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0]

    const monthTransactions = transactions.filter(
      (t) => t.date >= monthStart && t.date <= monthEnd
    )

    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const expense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    monthlyStats.push({
      month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
      income,
      expense,
    })
  }

  return {
    totalIncome,
    totalExpense,
    categoryStats,
    monthlyStats,
  }
}
