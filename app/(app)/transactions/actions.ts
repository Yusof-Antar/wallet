'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import type { Account, Category, Transaction } from '@/lib/types'

export async function getTransactionsData(filters?: {
  type?: 'income' | 'expense'
  accountId?: string
  startDate?: string
  endDate?: string
}) {
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

  // Get categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .or(`user_id.eq.${user.id},is_default.eq.true`)
    .order('name', { ascending: true })

  // Build transactions query
  let query = supabase
    .from('transactions')
    .select('*, account:accounts(*), category:categories(*)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters?.type) {
    query = query.eq('type', filters.type)
  }
  if (filters?.accountId) {
    query = query.eq('account_id', filters.accountId)
  }
  if (filters?.startDate) {
    query = query.gte('date', filters.startDate)
  }
  if (filters?.endDate) {
    query = query.lte('date', filters.endDate)
  }

  const { data: transactions } = await query.limit(100)

  return {
    accounts: (accounts as Account[]) || [],
    categories: (categories as Category[]) || [],
    transactions: (transactions as Transaction[]) || [],
  }
}

export async function updateTransaction(transactionId: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get original transaction
  const { data: original } = await supabase
    .from('transactions')
    .select('*, account:accounts(*)')
    .eq('id', transactionId)
    .eq('user_id', user.id)
    .single()

  if (!original) {
    return { error: 'Transaction not found' }
  }

  const type = formData.get('type') as 'income' | 'expense'
  const amount = Number.parseFloat(formData.get('amount') as string)
  const accountId = formData.get('account_id') as string
  const categoryId = formData.get('category_id') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string

  // Reverse original transaction's effect on balance
  const originalBalance = Number(original.account.balance)
  const reversedBalance =
    original.type === 'income'
      ? originalBalance - Number(original.amount)
      : originalBalance + Number(original.amount)

  await supabase
    .from('accounts')
    .update({ balance: reversedBalance })
    .eq('id', original.account_id)

  // Update transaction
  const { error: txError } = await supabase
    .from('transactions')
    .update({
      account_id: accountId,
      category_id: categoryId,
      type,
      amount,
      description: description || null,
      date,
    })
    .eq('id', transactionId)
    .eq('user_id', user.id)

  if (txError) {
    return { error: txError.message }
  }

  // Apply new transaction's effect on balance
  const { data: newAccount } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', accountId)
    .single()

  if (newAccount) {
    const newBalance =
      type === 'income'
        ? Number(newAccount.balance) + amount
        : Number(newAccount.balance) - amount

    await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId)
  }

  revalidateTag('transactions', 'max')
  revalidateTag('dashboard', 'max')
  revalidateTag('accounts', 'max')
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

  revalidateTag('transactions', 'max')
  revalidateTag('dashboard', 'max')
  revalidateTag('accounts', 'max')
  return { success: true }
}
