'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import type { Account, Category, Transaction } from '@/lib/types'

export async function getDashboardData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get accounts
  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  // Get categories (default + user's)
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .or(`user_id.eq.${user.id},is_default.eq.true`)
    .order('name', { ascending: true })

  // Get recent transactions with account and category info
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, account:accounts(*), category:categories(*)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(10)

  // Calculate totals for current month
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0]
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0]

  const { data: monthlyTransactions } = await supabase
    .from('transactions')
    .select('type, amount')
    .eq('user_id', user.id)
    .gte('date', startOfMonth)
    .lte('date', endOfMonth)

  const monthlyIncome =
    monthlyTransactions
      ?.filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0

  const monthlyExpense =
    monthlyTransactions
      ?.filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0

  const totalBalance =
    (accounts as Account[])?.reduce(
      (sum, acc) => sum + Number(acc.balance),
      0
    ) || 0

  return {
    accounts: (accounts as Account[]) || [],
    categories: (categories as Category[]) || [],
    transactions: (transactions as Transaction[]) || [],
    monthlyIncome,
    monthlyExpense,
    totalBalance,
  }
}

export async function addTransaction(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const type = formData.get('type') as 'income' | 'expense'
  const amount = Number.parseFloat(formData.get('amount') as string)
  const accountId = formData.get('account_id') as string
  const categoryId = formData.get('category_id') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string

  // Insert transaction
  const { error: txError } = await supabase.from('transactions').insert({
    user_id: user.id,
    account_id: accountId,
    category_id: categoryId,
    type,
    amount,
    description: description || null,
    date,
  })

  if (txError) {
    return { error: txError.message }
  }

  // Update account balance
  const { data: account } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', accountId)
    .single()

  if (account) {
    const newBalance =
      type === 'income'
        ? Number(account.balance) + amount
        : Number(account.balance) - amount

    await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId)
  }

  revalidateTag('dashboard', 'max')
  return { success: true }
}

export async function deleteTransaction(transactionId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get the transaction to reverse the balance
  const { data: transaction } = await supabase
    .from('transactions')
    .select('*, account:accounts(*)')
    .eq('id', transactionId)
    .eq('user_id', user.id)
    .single()

  if (!transaction) {
    return { error: 'Transaction not found' }
  }

  // Reverse the account balance
  const currentBalance = Number(transaction.account.balance)
  const newBalance =
    transaction.type === 'income'
      ? currentBalance - Number(transaction.amount)
      : currentBalance + Number(transaction.amount)

  await supabase
    .from('accounts')
    .update({ balance: newBalance })
    .eq('id', transaction.account_id)

  // Delete transaction
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidateTag('dashboard', 'max')
  return { success: true }
}
