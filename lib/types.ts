export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  currency: string
  created_at: string
}

export interface Account {
  id: string
  user_id: string
  name: string
  type: 'cash' | 'bank' | 'credit' | 'savings' | 'investment'
  balance: number
  color: string
  icon: string
  created_at: string
}

export interface Category {
  id: string
  user_id: string | null
  name: string
  type: 'income' | 'expense'
  icon: string
  color: string
  is_default: boolean
}

export interface Transaction {
  id: string
  user_id: string
  account_id: string
  category_id: string
  type: 'income' | 'expense'
  amount: number
  description: string | null
  date: string
  created_at: string
  account?: Account
  category?: Category
}

export interface ChecklistItem {
  id: string
  user_id: string
  title: string
  target_amount: number
  saved_amount: number
  priority: 'low' | 'medium' | 'high'
  is_completed: boolean
  created_at: string
}

export interface MonthlyStats {
  month: string
  income: number
  expense: number
}

export interface CategoryStats {
  category_id: string
  category_name: string
  category_icon: string
  category_color: string
  total: number
  percentage: number
}
