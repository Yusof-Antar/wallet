'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import type { Account } from '@/lib/types'

export async function getAccounts() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: accounts, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) {
    return { error: error.message }
  }

  return { accounts: accounts as Account[] }
}

export async function addAccount(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const name = formData.get('name') as string
  const type = formData.get('type') as Account['type']
  const balance = Number.parseFloat(formData.get('balance') as string) || 0
  const color = formData.get('color') as string
  const icon = formData.get('icon') as string

  const { error } = await supabase.from('accounts').insert({
    user_id: user.id,
    name,
    type,
    balance,
    color,
    icon,
  })

  if (error) {
    return { error: error.message }
  }

  revalidateTag('accounts', 'max')
  revalidateTag('dashboard', 'max')
  return { success: true }
}

export async function updateAccount(accountId: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const name = formData.get('name') as string
  const type = formData.get('type') as Account['type']
  const balance = Number.parseFloat(formData.get('balance') as string) || 0
  const color = formData.get('color') as string
  const icon = formData.get('icon') as string

  const { error } = await supabase
    .from('accounts')
    .update({
      name,
      type,
      balance,
      color,
      icon,
    })
    .eq('id', accountId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidateTag('accounts', 'max')
  revalidateTag('dashboard', 'max')
  return { success: true }
}

export async function deleteAccount(accountId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if there are any transactions for this account
  const { count } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('account_id', accountId)

  if (count && count > 0) {
    return { error: 'Cannot delete account with existing transactions. Delete transactions first.' }
  }

  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', accountId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidateTag('accounts', 'max')
  revalidateTag('dashboard', 'max')
  return { success: true }
}
