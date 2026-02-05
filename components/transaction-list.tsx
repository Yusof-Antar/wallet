'use client'

import React from "react"

import { formatCurrency } from '@/lib/currency'
import type { Transaction } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  Briefcase,
  Car,
  Coffee,
  DollarSign,
  Film,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Pill,
  Plane,
  ShoppingBag,
  Smartphone,
  Utensils,
  Wallet,
  Zap,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  briefcase: Briefcase,
  car: Car,
  coffee: Coffee,
  dollar: DollarSign,
  film: Film,
  gift: Gift,
  graduation: GraduationCap,
  heart: Heart,
  home: Home,
  pill: Pill,
  plane: Plane,
  shopping: ShoppingBag,
  smartphone: Smartphone,
  utensils: Utensils,
  wallet: Wallet,
  zap: Zap,
}

interface TransactionListProps {
  transactions: Transaction[]
  currency?: string
  onTransactionClick?: (transaction: Transaction) => void
}

export function TransactionList({
  transactions,
  currency = 'USD',
  onTransactionClick,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Wallet className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">No transactions yet</p>
        <p className="text-xs text-muted-foreground">Add your first transaction to get started</p>
      </div>
    )
  }

  // Group transactions by date
  const grouped = transactions.reduce(
    (acc, transaction) => {
      const date = transaction.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(transaction)
      return acc
    },
    {} as Record<string, Transaction[]>
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped).map(([date, txs]) => (
        <div key={date}>
          <p className="mb-2 text-xs font-medium text-muted-foreground">{formatDate(date)}</p>
          <div className="flex flex-col gap-2">
            {txs.map((transaction) => {
              const IconComponent =
                iconMap[transaction.category?.icon || 'wallet'] || Wallet
              return (
                <button
                  key={transaction.id}
                  type="button"
                  onClick={() => onTransactionClick?.(transaction)}
                  className="flex items-center gap-3 rounded-xl bg-card p-3 text-left transition-colors hover:bg-muted"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${transaction.category?.color || '#6b7280'}20`,
                    }}
                  >
                    <IconComponent
                      className="h-5 w-5"
                      style={{ color: transaction.category?.color || '#6b7280' }}
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-medium text-foreground">
                      {transaction.category?.name || 'Unknown'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {transaction.description || transaction.account?.name}
                    </p>
                  </div>
                  <p
                    className={cn(
                      'font-semibold',
                      transaction.type === 'income' ? 'text-income' : 'text-expense'
                    )}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount, currency)}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
