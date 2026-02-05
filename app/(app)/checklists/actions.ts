'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import type { ChecklistItem } from '@/lib/types'

export async function getChecklists() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: items, error } = await supabase
    .from('checklists')
    .select('*')
    .eq('user_id', user.id)
    .order('is_completed', { ascending: true })
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { items: items as ChecklistItem[] }
}

export async function addChecklistItem(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const title = formData.get('title') as string
  const targetAmount = Number.parseFloat(formData.get('target_amount') as string) || 0
  const savedAmount = Number.parseFloat(formData.get('saved_amount') as string) || 0
  const priority = formData.get('priority') as ChecklistItem['priority']

  const { error } = await supabase.from('checklists').insert({
    user_id: user.id,
    title,
    target_amount: targetAmount,
    saved_amount: savedAmount,
    priority,
    is_completed: false,
  })

  if (error) {
    return { error: error.message }
  }

  revalidateTag('checklists', 'max')
  return { success: true }
}

export async function updateChecklistItem(itemId: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const title = formData.get('title') as string
  const targetAmount = Number.parseFloat(formData.get('target_amount') as string) || 0
  const savedAmount = Number.parseFloat(formData.get('saved_amount') as string) || 0
  const priority = formData.get('priority') as ChecklistItem['priority']
  const isCompleted = savedAmount >= targetAmount

  const { error } = await supabase
    .from('checklists')
    .update({
      title,
      target_amount: targetAmount,
      saved_amount: savedAmount,
      priority,
      is_completed: isCompleted,
    })
    .eq('id', itemId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidateTag('checklists', 'max')
  return { success: true }
}

export async function toggleChecklistItem(itemId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get current state
  const { data: item } = await supabase
    .from('checklists')
    .select('is_completed')
    .eq('id', itemId)
    .eq('user_id', user.id)
    .single()

  if (!item) {
    return { error: 'Item not found' }
  }

  const { error } = await supabase
    .from('checklists')
    .update({ is_completed: !item.is_completed })
    .eq('id', itemId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidateTag('checklists', 'max')
  return { success: true }
}

export async function deleteChecklistItem(itemId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('checklists')
    .delete()
    .eq('id', itemId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidateTag('checklists', 'max')
  return { success: true }
}
