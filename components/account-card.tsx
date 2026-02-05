'use client'

import React from "react"

import { formatCurrency } from '@/lib/currency'
import type { Account } from '@/lib/types'
import {
  Banknote,
  Building2,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Wallet,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wallet: Wallet,
  bank: Building2,
  card: CreditCard,
  cash: Banknote,
  piggy: PiggyBank,
  chart: TrendingUp,
}

const typeLabels: Record<Account['type'], string> = {
  cash: 'Cash',
  bank: 'Bank Account',
  credit: 'Credit Card',
  savings: 'Savings',
  investment: 'Investment',
}

interface AccountCardProps {
  account: Account
  currency?: string
  onClick?: () => void
}

export function AccountCard({ account, currency = 'USD', onClick }: AccountCardProps) {
  const IconComponent = iconMap[account.icon] || Wallet

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl bg-card p-4 text-left transition-colors hover:bg-muted"
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${account.color}20` }}
      >
        <IconComponent
          className="h-6 w-6"
          style={{ color: account.color }}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="truncate font-medium text-foreground">{account.name}</p>
        <p className="text-sm text-muted-foreground">{typeLabels[account.type]}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-foreground">
          {formatCurrency(account.balance, currency)}
        </p>
      </div>
    </button>
  )
}
